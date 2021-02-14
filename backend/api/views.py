import datetime as dt
import html
import json
import os
import re
import time

import jwt
import requests
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core.mail import EmailMessage, send_mail
from django.core.serializers import serialize
from django.db.models.query import QuerySet
from django.template.loader import get_template
from requests import api
from rest_framework import generics, permissions, serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from smtplib import SMTPException

from .models import DailyValueFoodComponent, DailyValueNutrient, Log, Meal, Nutrient, Profile
from .serializers import (
    CreateUserSerializer,
    ProfileSerializer,
    TokenIdObtainSerializer,
    UpdatePasswordSerializer,
    UpdateUserSerializer,
)


class SendContactEmail(APIView):
    """sends contact mail to administrat

    Returns:
        Response: success message or raised exception
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        name = html.escape(request.data["name"])
        email = html.escape(request.data["email"])
        comment = html.escape(request.data["comment"])

        mail_status = self.sendMail(name, email, comment)
        if mail_status == "Mail was successfully sent":
            return Response({"status": mail_status}, status=status.HTTP_200_OK)

        return Response({"status": mail_status}, status=status.HTTP_400_BAD_REQUEST)

    def sendMail(self, name, email, comment):
        context = {"name": name, "email": email, "comment": comment}
        message = get_template("contact.html").render(context)
        msg = EmailMessage(
            "Nutrifood - New contact mail from user: " + name,
            message,
            email,
            [os.getenv("ADMIN_EMAIL_ADDRESS")],
            reply_to=[email],
        )
        msg.content_subtype = "html"
        try:
            msg.send()
        except SMTPException as e:
            error = "There was an error sending an email: " + str(e)
            return error
        return "Mail was successfully sent"


class SetNewPassword(APIView):
    """Sets a new password for the user after a forgot password request

    Returns:
        Response: message of either successfull or failed password save
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UpdatePasswordSerializer

    def post(self, request):
        token = request.data["token"]
        user = User.objects.filter(username=request.data["username"])

        if user.exists():
            password = user[0].password.replace("pbkdf2_sha256$216000$", "")
            try:
                decoded_token = jwt.decode(token, password, algorithms="HS256")

                if decoded_token["pw-reset"] == user[0].date_joined.timestamp():

                    request_data = {
                        "username": user[0].username,
                        "password": request.data["password"],
                    }

                    serializer = self.serializer_class(user, data=request_data, context={"username": user[0].username})

                    if serializer.is_valid(raise_exception=True):

                        serializer.save(id=user[0].id)

                        return Response({"message": "Password successfully updated"}, status=status.HTTP_200_OK)

                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                return Response({"error": "Token does not match with user"}, status=status.HTTP_400_BAD_REQUEST)
            except jwt.InvalidSignatureError:
                return Response({"error": "Token not valid"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPassord(APIView):
    """Request for forgot password
        Sends email to user with json web token generated from "date_joined"
        timestamp with password hash as a key.

    Returns:
        Response: Always response success for security reasons
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        user = User.objects.filter(username=request.data["username"])
        if user.exists():
            token = self.generateToken(user[0].password, user[0].date_joined)

            link = os.getenv("FRONTEND_URL") + "new-password?username=" + user[0].username + "&token=" + token

            self.sendMail(user[0].username, user[0].email, link)

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        return Response({"status": "success"}, status=status.HTTP_200_OK)

    def generateToken(self, passwordHash, date_joined):
        password = passwordHash.replace("pbkdf2_sha256$216000$", "")

        expiry = dt.datetime.now() + dt.timedelta(days=1)

        payload = {"pw-reset": date_joined.timestamp(), "exp": expiry.timestamp()}

        return jwt.encode(
            payload,
            password,
            algorithm="HS256",
        )

    def sendMail(self, username, email, link):
        context = {"username": username, "link": link}
        message = get_template("forgot-mail.html").render(context)
        msg = EmailMessage(
            "Nutrifood - Forgot password request",
            message,
            os.getenv("ADMIN_EMAIL_ADDRESS"),
            [email],
        )
        msg.content_subtype = "html"
        msg.send()
        return


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    """Blacklists token when user logs out

    Returns:
        Response: status code 205 for blacklist success
        or error in case of failure
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)


class ObtainTokenPairWithIdView(TokenObtainPairView):
    """Custom claim id included in token pair"""

    permission_classes = (permissions.AllowAny,)
    serializer_class = TokenIdObtainSerializer


class CreateUser(APIView):
    """Creates new user
        Also creates a profile and log and associates it with the user, triggered on save

    Returns:
        Response: serialized user data
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = CreateUserSerializer

    def post(self, request, format="json"):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserdata(APIView):
    """Updates users username, password or email, based in request
        In order to only update the password, if the user provided one,
        we pop the password if the string is empty

    Returns:
        Response: serialized data
    """

    serializer_class = UpdateUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request):
        user = User.objects.get(username=request.user)
        if request.data["password"] == "":
            request.data.pop("password")
            passwordChanged = False
        else:
            passwordChanged = True

        serializer = self.serializer_class(user, data=request.data, context={"request": request})

        if serializer.is_valid():

            serializer.save(id=user.id)

            response_data = serializer.data
            if passwordChanged:
                response_data["password"] = "was changed"

            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateProfile(APIView):
    """Updates user profile with birthday and weight

    Returns:
        Response: serialized data
    """

    serializer_class = ProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            profile = Profile.objects.get(user=request.user)
            profile.birth_date = serializer.data.get("birth_date")
            profile.weight = serializer.data.get("weight")
            profile.save(update_fields=["birth_date", "weight"])

            return Response(ProfileSerializer(profile).data, status=status.HTTP_200_OK)

        return Response({"Bad Request": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)


class UserProfile(APIView):
    """Constructs the output for user profiles

    Returns:
        Response: Object containing user profile data
    """

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        profile_data = ProfileSerializer(profile).data
        profile_data["id"] = profile.id
        profile_data["username"] = request.user.username
        profile_data["email"] = request.user.email
        return Response(profile_data, status=status.HTTP_200_OK)


class AddToLog(APIView):
    """Adds food items to user log

    Returns:
        Response: successful message
    """

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        log = Log.objects.filter(profile=profile)

        if log.exists():
            self.addMealToLog(request.data, log[0])
        else:
            log = Log.objects.create()
            log.profile.add(profile)
            self.addMealToLog(request.data, log)

        return Response({"Message": "successful"}, status=status.HTTP_200_OK)

    def addMealToLog(self, meals, log):
        for meal in meals["data"]:
            food = meal["name"]
            unit = meal["serving_unit"]
            quantity = meal["serving_qty"]
            calories = self.findCalories(meal["full_nutrients"])
            weight = meal["serving_weight_grams"]
            meal_day, meal_time, *rest = re.split("T|\+", meal["consumed_at"])
            created_meal = Meal.objects.create(
                food=food,
                unit=unit,
                quantity=quantity,
                calories=calories,
                weight=weight,
                meal_day=meal_day,
                meal_time=meal_time,
            )
            created_meal.log.add(log)

    def findCalories(self, nutrients):
        calories = 0
        for nutrient in nutrients:
            if nutrient["attr_id"] == 208:
                calories = nutrient["value"]
                break
        return calories


class GetLog(APIView):
    """Gets log data

    Args:

    Returns:
        Response: Log data for user
    """

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        log = Log.objects.get(profile=profile)

        meals = Meal.objects.filter(log=log).order_by("-meal_day")

        log_data = self.transformOutput(meals)
        return Response(log_data, status=status.HTTP_200_OK)

    def transformOutput(self, meals):
        transformed_data = {}
        utc_offset = time.localtime().tm_gmtoff / 3600
        for meal in meals:
            meal_time = dt.datetime.combine(meal.meal_day, meal.meal_time)
            meal_localTime = meal_time + dt.timedelta(hours=utc_offset)
            day = str(meal_localTime.date())
            if day not in transformed_data:
                transformed_data[day] = []

            transformed_data[day].append(
                {
                    "id": meal.id,
                    "food": meal.food,
                    "unit": meal.unit,
                    "quantity": meal.quantity,
                    "calories": meal.calories,
                    "weight": meal.weight,
                    "meal_time": meal_localTime.time(),
                }
            )

        return transformed_data


class DeleteLogItem(APIView):
    """Deletes item from log

    Returns:
        Response: success or fail
    """

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        deleted_meal = Meal.objects.filter(pk=request.data["id"]).delete()
        if deleted_meal == (0, {}):
            return Response({"status": "No item found"}, status=status.HTTP_410_GONE)

        return Response({"status": "success"}, status=status.HTTP_200_OK)


class GetRecipes(APIView):
    """Retrieve recipe from Spoonacular API

    Returns:
        Response: recipe data
        If API limits are reached Mock recipe is returned
    """

    permission_classes = (permissions.AllowAny,)

    endpoint = "https://api.spoonacular.com/recipes/complexSearch"

    def get(self, request):
        payload = {
            "query": request.GET.get("query"),
            "apiKey": os.getenv("spoonacular_apiKEY"),
            "addRecipeNutrition": True,
            "number": request.GET.get("number"),
        }
        response = requests.get(self.endpoint, params=payload)

        data = response.json()

        mockdata = False
        if "status" in data:
            if data["status"] == "failure" and data["code"] == 402:
                data["results"] = self.mockdata()
                mockdata = True

        recipes = []
        for recipe in data["results"]:
            recipes.append(self.formatRecipe(recipe))

        return Response({"data": recipes, "mockdata": mockdata}, status=status.HTTP_200_OK)

    def formatRecipe(self, recipe):
        return {
            "id": recipe["id"],
            "title": recipe["title"],
            "summary": recipe["summary"],
            "servings": recipe["servings"],
            "readyInMinutes": recipe["readyInMinutes"],
            "healthScore": recipe["healthScore"],
            "caloricBreakdown": recipe["nutrition"]["caloricBreakdown"],
            "pricePerServing": round(recipe["pricePerServing"]) / 100,
            "image": recipe["image"],
            "sourceName": "Spoonacular",
            "sourceUrl": recipe["spoonacularSourceUrl"],
            "analyzedInstructions": recipe["analyzedInstructions"],
        }

    def mockdata(self):
        return [
            {
                "id": 716429,
                "calories": 584,
                "carbs": "84g",
                "fat": "20g",
                "image": "https://spoonacular.com/recipeImages/716429-312x231.jpg",
                "imageType": "jpg",
                "protein": "19g",
                "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
                "summary": 'Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs might be a good recipe to expand your main course repertoire. One portion of this dish contains approximately <b>19g of protein </b>,  <b>20g of fat </b>, and a total of  <b>584 calories </b>. For  <b>$1.63 per serving </b>, this recipe  <b>covers 23% </b> of your daily requirements of vitamins and minerals. This recipe serves 2. It is brought to you by fullbellysisters.blogspot.com. 209 people were glad they tried this recipe. A mixture of scallions, salt and pepper, white wine, and a handful of other ingredients are all it takes to make this recipe so scrumptious. From preparation to the plate, this recipe takes approximately  <b>45 minutes </b>. All things considered, we decided this recipe  <b>deserves a spoonacular score of 83% </b>. This score is awesome. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/cauliflower-gratin-with-garlic-breadcrumbs-318375">Cauliflower Gratin with Garlic Breadcrumbs</a>, < href="https://spoonacular.com/recipes/pasta-with-cauliflower-sausage-breadcrumbs-30437">Pasta With Cauliflower, Sausage, & Breadcrumbs</a>, and <a href="https://spoonacular.com/recipes/pasta-with-roasted-cauliflower-parsley-and-breadcrumbs-30738">Pasta With Roasted Cauliflower, Parsley, And Breadcrumbs</a>.',
                "readyInMinutes": 45,
                "healthScore": 19.0,
                "nutrition": {"caloricBreakdown": {"percentProtein": 3.88, "percentFat": 1.94, "percentCarbs": 94.18}},
                "pricePerServing": 163.15,
                "sourceName": "Spoonacular",
                "spoonacularSourceUrl": "https://spoonacular.com/pasta-with-garlic-scallions-cauliflower-breadcrumbs-716429",
                "analyzedInstructions": [],
                "servings": 2,
            }
        ]


class InstantSearch(APIView):
    """Gets instant search results from Nutritionix API

    Returns:
        Resonse: Food data
    """

    permission_classes = (permissions.AllowAny,)

    endpoint = "https://trackapi.nutritionix.com/v2/search/instant"
    lookup_url_kwarg = "query"

    def get(self, request):
        query = request.GET.get(self.lookup_url_kwarg)

        payload = "query=" + query
        headers = {
            "x-app-id": os.getenv("nutritionix_app_id"),
            "x-app-key": os.getenv("nutritionix_app_key"),
            "content": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        }

        response = requests.request("POST", self.endpoint, headers=headers, data=payload)

        data = response.json()

        return Response({"data": data}, status=status.HTTP_200_OK)


class GetNutrients(APIView):
    """Get nutrients for query from Nutritionix API

    Returns:
        Response: Nutrition data
        If API limits are reached Mock nutritional data is returned
    """

    permission_classes = (permissions.AllowAny,)

    endpoint = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    lookup_url_kwarg = "query"

    def get(self, request):
        query = request.GET.get(self.lookup_url_kwarg)

        payload = "query=" + query
        headers = {
            "x-app-id": os.getenv("nutritionix_app_id"),
            "x-app-key": os.getenv("nutritionix_app_key"),
            "content": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        }

        response = requests.request("POST", self.endpoint, headers=headers, data=payload)
        if response.status_code == 404:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = response.json()

        if response.status_code == 401:
            data = self.useMockData()

        serialized_data, nutrient_label = self.prepareOutputData(data["foods"])

        return Response(
            {"data": serialized_data, "label": Food.formatNutrientLabel(nutrient_label)}, status=status.HTTP_200_OK
        )

    def prepareOutputData(self, foodData):
        serialized_data = []
        nutrient_label = {}

        for index, food in enumerate(foodData, start=1):
            serialized_data.append(Food(food).get())
            prev_nutrient_label = nutrient_label
            nutrient_label = Food(food).getNutrientLabelValues()
            if index > 1:
                nutrient_label = {
                    k: prev_nutrient_label.get(k, 0) + nutrient_label.get(k, 0)
                    for k in prev_nutrient_label.keys() | nutrient_label.keys()
                }
        return [serialized_data, nutrient_label]

    def useMockData(self):
        return {
            "foods": [
                {
                    "food_name": "chicken noodle soup",
                    "brand_name": None,
                    "serving_qty": 1,
                    "serving_unit": "cup",
                    "serving_weight_grams": 248,
                    "nf_calories": 62,
                    "nf_total_fat": 2.36,
                    "nf_saturated_fat": 0.65,
                    "nf_cholesterol": 12.4,
                    "nf_sodium": 865.52,
                    "nf_total_carbohydrate": 7.32,
                    "nf_dietary_fiber": 0.5,
                    "nf_sugars": 0.67,
                    "nf_protein": 3.15,
                    "nf_potassium": 54.56,
                    "nf_p": 42.16,
                    "full_nutrients": [
                        {"attr_id": 203, "value": 3.1496},
                        {"attr_id": 204, "value": 2.356},
                        {"attr_id": 205, "value": 7.316},
                        {"attr_id": 207, "value": 2.5048},
                        {"attr_id": 208, "value": 62},
                        {"attr_id": 221, "value": 0},
                        {"attr_id": 255, "value": 232.6736},
                        {"attr_id": 262, "value": 0},
                        {"attr_id": 263, "value": 0},
                        {"attr_id": 268, "value": 262.88},
                        {"attr_id": 269, "value": 0.6696},
                        {"attr_id": 291, "value": 0.496},
                        {"attr_id": 301, "value": 14.88},
                        {"attr_id": 303, "value": 1.6368},
                        {"attr_id": 304, "value": 9.92},
                        {"attr_id": 305, "value": 42.16},
                        {"attr_id": 306, "value": 54.56},
                        {"attr_id": 307, "value": 865.52},
                        {"attr_id": 309, "value": 0.3968},
                        {"attr_id": 312, "value": 0.1587},
                        {"attr_id": 315, "value": 0.1265},
                        {"attr_id": 317, "value": 11.904},
                        {"attr_id": 318, "value": 498.48},
                        {"attr_id": 319, "value": 2.48},
                        {"attr_id": 320, "value": 27.28},
                        {"attr_id": 321, "value": 295.12},
                        {"attr_id": 322, "value": 0},
                        {"attr_id": 323, "value": 0.0744},
                        {"attr_id": 324, "value": 0},
                        {"attr_id": 328, "value": 0},
                        {"attr_id": 334, "value": 0},
                        {"attr_id": 337, "value": 0},
                        {"attr_id": 338, "value": 9.92},
                        {"attr_id": 401, "value": 0},
                        {"attr_id": 404, "value": 0.1364},
                        {"attr_id": 405, "value": 0.1116},
                        {"attr_id": 406, "value": 1.3392},
                        {"attr_id": 410, "value": 0.1835},
                        {"attr_id": 415, "value": 0.0496},
                        {"attr_id": 417, "value": 19.84},
                        {"attr_id": 418, "value": 0.0496},
                        {"attr_id": 421, "value": 13.64},
                        {"attr_id": 430, "value": 0},
                        {"attr_id": 431, "value": 14.88},
                        {"attr_id": 432, "value": 4.96},
                        {"attr_id": 435, "value": 29.76},
                        {"attr_id": 601, "value": 12.4},
                        {"attr_id": 605, "value": 0.0074},
                        {"attr_id": 606, "value": 0.6498},
                        {"attr_id": 607, "value": 0},
                        {"attr_id": 608, "value": 0},
                        {"attr_id": 609, "value": 0},
                        {"attr_id": 610, "value": 0},
                        {"attr_id": 611, "value": 0.0025},
                        {"attr_id": 612, "value": 0.0124},
                        {"attr_id": 613, "value": 0.4861},
                        {"attr_id": 614, "value": 0.1314},
                        {"attr_id": 615, "value": 0.0074},
                        {"attr_id": 617, "value": 0.8432},
                        {"attr_id": 618, "value": 0.5952},
                        {"attr_id": 619, "value": 0.0446},
                        {"attr_id": 620, "value": 0.0099},
                        {"attr_id": 621, "value": 0},
                        {"attr_id": 624, "value": 0.005},
                        {"attr_id": 625, "value": 0.005},
                        {"attr_id": 626, "value": 0.129},
                        {"attr_id": 627, "value": 0},
                        {"attr_id": 628, "value": 0.0198},
                        {"attr_id": 629, "value": 0},
                        {"attr_id": 630, "value": 0.0099},
                        {"attr_id": 631, "value": 0},
                        {"attr_id": 645, "value": 1.0366},
                        {"attr_id": 646, "value": 0.6547},
                        {"attr_id": 652, "value": 0.0025},
                        {"attr_id": 653, "value": 0.005},
                        {"attr_id": 654, "value": 0.0025},
                        {"attr_id": 672, "value": 0.005},
                        {"attr_id": 687, "value": 0.0198},
                        {"attr_id": 689, "value": 0.0025},
                        {"attr_id": 697, "value": 0.0099},
                    ],
                    "nix_brand_name": None,
                    "nix_brand_id": None,
                    "nix_item_name": None,
                    "nix_item_id": None,
                    "upc": None,
                    "consumed_at": "2017-07-13T13:46:25+00:00",
                    "metadata": {},
                    "source": 1,
                    "ndb_no": 6419,
                    "tags": {"item": "chicken noodle soup", "measure": "cup", "quantity": "1.0", "tag_id": 256},
                    "alt_measures": [
                        {"serving_weight": 248, "measure": "serving 1 cup", "seq": 1, "qty": 1},
                        {"serving_weight": 248, "measure": "cup", "seq": 80, "qty": 1},
                        {"serving_weight": 586, "measure": "can", "seq": 81, "qty": 1},
                        {"serving_weight": 496, "measure": "bowl (2 cups)", "seq": 82, "qty": 1},
                        {"serving_weight": 5.17, "measure": "tsp", "seq": 101, "qty": 1},
                        {"serving_weight": 15.5, "measure": "tbsp", "seq": 102, "qty": 1},
                    ],
                    "lat": None,
                    "lng": None,
                    "meal_type": 1,
                    "photo": {
                        "thumb": "https://d2xdmhkmkbyw75.cloudfront.net/256_thumb.jpg",
                        "highres": "https://d2xdmhkmkbyw75.cloudfront.net/256_highres.jpg",
                    },
                }
            ]
        }


class Food:
    """Transform input data into usable food label data"""

    def __init__(self, food):
        self.name = food["food_name"]
        self.brand_name = food["brand_name"]
        self.serving_qty = food["serving_qty"]
        self.serving_unit = food["serving_unit"]
        self.serving_weight_grams = food["serving_weight_grams"]
        self.full_nutrients = food["full_nutrients"]
        self.nix = self.unpack(food, "nix_")
        self.consumed_at = food["consumed_at"]
        self.metadata = food["metadata"]
        self.tags = food["tags"]
        self.alt_measures = food["alt_measures"]
        self.photo = food["photo"]

    def unpack(self, obj, key):
        unpacked_obj = {}
        for obj_key, item in obj.items():
            if key in obj_key:
                unpacked_obj[obj_key.removeprefix(key)] = item
        return unpacked_obj

    def get(self):
        return {
            "name": self.name,
            "serving_qty": self.serving_qty,
            "serving_unit": self.serving_unit,
            "serving_weight_grams": self.serving_weight_grams,
            "brand_name": self.brand_name,
            "food_nix": self.nix,
            "full_nutrients": self.associateFullNutrients(),
            "consumed_at": self.consumed_at,
            "metadata": self.metadata,
            "tags": self.tags,
            "alt_measures": self.alt_measures,
            "photo": self.photo,
        }

    def associateFullNutrients(self):
        # attr_id, usda_tag, name, unit, conversion_unit
        associated_nutrients = []

        for single_nutrient in self.full_nutrients:
            if single_nutrient["value"] == 0:
                continue

            queryset = Nutrient.objects.filter(attr_id=single_nutrient["attr_id"])
            nutrient = {}
            if queryset.exists():
                nutrient["attr_id"] = single_nutrient["attr_id"]
                nutrient["name"] = queryset[0].name
                nutrient["unit"] = queryset[0].unit
                nutrient["value"] = single_nutrient["value"]
                associated_nutrients.append(nutrient)

        return associated_nutrients

    def getNutrientLabelValues(self):
        return {
            "serving_weight_grams": self.serving_weight_grams,
            "kcal": self.getNutrientValue(208),
            "kJ": self.getNutrientValue(268),
            "total_fat": self.getNutrientValue(204),
            "saturated_fat": self.getNutrientValue(606),
            "trans_fat": self.getNutrientValue(605),
            "poly": self.getNutrientValue(646),
            "mono": self.getNutrientValue(645),
            "cholesterol": self.getNutrientValue(601),
            "sodium": self.getNutrientValue(307),
            "total_carbohydrate": self.getNutrientValue(205),
            "dietary_fiber": self.getNutrientValue(291),
            "total_sugars": self.getNutrientValue(269),
            "protein": self.getNutrientValue(203),
            "vitamin_d": self.getNutrientValue(324),
            "calcium": self.getNutrientValue(301),
            "iron": self.getNutrientValue(303),
            "potassium": self.getNutrientValue(306),
        }

    def getNutrientValue(self, nutrient_id):
        for single_nutrient in self.full_nutrients:
            if single_nutrient["attr_id"] == nutrient_id:
                return single_nutrient["value"]
        return 0

    @classmethod
    def getNutrientData(self, value, nutrient_id):
        dataset = {}
        nutrient_query = Nutrient.objects.get(attr_id=nutrient_id)
        dataset["unit"] = nutrient_query.unit
        dataset["value"] = round(value, 2)

        dv_nutrient = DailyValueNutrient.objects.filter(nutrient=nutrient_id)
        if dv_nutrient.exists():
            dataset["daily_value"] = round((value / float(dv_nutrient[0].value)) * 100)
            return dataset

        dv_foodComponent = DailyValueFoodComponent.objects.filter(nutrient=nutrient_id)
        if dv_foodComponent.exists():
            dataset["daily_value"] = round((value / float(dv_foodComponent[0].value)) * 100)

        return dataset

    @classmethod
    def formatNutrientLabel(self, nutrientValues):
        return {
            "serving_weight_grams": nutrientValues["serving_weight_grams"],
            "calories": {
                "kcal": self.getNutrientData(nutrientValues["kcal"], 208),
                "kJ": self.getNutrientData(nutrientValues["kJ"], 268),
            },
            "fat": {
                "total_fat": self.getNutrientData(nutrientValues["total_fat"], 204),
                "sub": {
                    "1_saturated_fat": self.getNutrientData(nutrientValues["saturated_fat"], 606),
                    "2_trans_fat": self.getNutrientData(nutrientValues["trans_fat"], 605),
                    "3_polyunsaturated_fat": self.getNutrientData(nutrientValues["poly"], 646),
                    "4_monounsaturated_fat": self.getNutrientData(nutrientValues["mono"], 645),
                },
            },
            "cholesterol": self.getNutrientData(nutrientValues["cholesterol"], 601),
            "sodium": self.getNutrientData(nutrientValues["sodium"], 307),
            "carbohydrate": {
                "total_carbohydrate": self.getNutrientData(nutrientValues["total_carbohydrate"], 205),
                "sub": {
                    "1_dietary_fiber": self.getNutrientData(nutrientValues["dietary_fiber"], 291),
                    "2_total_sugars": self.getNutrientData(nutrientValues["total_sugars"], 269),
                },
            },
            "protein": self.getNutrientData(nutrientValues["protein"], 203),
            "vitamin_d": self.getNutrientData(nutrientValues["vitamin_d"] * 0.025, 324),
            "calcium": self.getNutrientData(nutrientValues["calcium"], 301),
            "iron": self.getNutrientData(nutrientValues["iron"], 303),
            "potassium": self.getNutrientData(nutrientValues["potassium"], 306),
        }
