from rest_framework import serializers
from .models import Nutrient, Profile
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
import django.contrib.auth.password_validation as validators
from django.core import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class NutrientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrient
        fields = "__all__"


class UpdatePasswordSerializer(serializers.ModelSerializer):
    """Serializer for updating passwords. Validates passwords

    Raises:
        serializers.ValidationError: Raise all validation errors

    Returns:
        Instance: Returns user model instance
    """

    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {
            "username": {"required": False, "validators": []},
            "password": {"write_only": True, "required": True},
            "email": {"required": False},
        }

    def validate_password(self, value):
        user = User.objects.get(username=self.context["username"])

        errors = dict()
        try:
            validators.validate_password(password=value, user=user)
        except exceptions.ValidationError as e:
            errors["password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return value

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save(force_update=True)
        return instance


class UpdateUserSerializer(serializers.ModelSerializer):
    """Serializer for updating users. Validates passwords and usernames

    Raises:
        serializers.ValidationError: Raise all validation errors

    Returns:
        Instance: Returns user model instance
    """

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "username": {"required": False, "validators": []},
            "password": {"write_only": True, "required": False},
        }

    def validate_username(self, value):
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value

    def validate_password(self, value):
        print(self.context["request"])
        user = self.context["request"].user

        errors = dict()
        try:
            validators.validate_password(password=value, user=user)
        except exceptions.ValidationError as e:
            errors["password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return value

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save(force_update=True)
        return instance


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("birth_date", "weight", "log")


class CreateUserSerializer(serializers.ModelSerializer):
    """Serializer for creating users. Validates passwords and usernames

    Raises:
        serializers.ValidationError: Raise all validation errors

    Returns:
        Instance: Returns user model instance
    """

    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        user = User(**data)

        password = data.get("password")

        errors = dict()
        try:
            validators.validate_password(password=password, user=user)
        except exceptions.ValidationError as e:
            errors["password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(CreateUserSerializer, self).validate(data)

    def create(self, validated_data):
        if User.objects.filter(**validated_data).exists():
            raise Exception("User already exists")
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class TokenIdObtainSerializer(TokenObtainPairSerializer):
    """Token serializer which adds ID to the token pair

    Args:
        TokenObtainPairSerializer

    Returns:
        JWT: JWT token pair for access and refresh tokens
    """

    @classmethod
    def get_token(cls, user):
        token = super(TokenIdObtainSerializer, cls).get_token(user)
        token["id"] = user.id

        return token


class TokenIdObtainView(TokenObtainPairView):
    serializer_class = TokenIdObtainSerializer
