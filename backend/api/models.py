from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import date


class Nutrient(models.Model):
    attr_id = models.IntegerField(primary_key=True)
    usda_tag = models.CharField(max_length=20)
    name = models.CharField(max_length=120)
    unit = models.CharField(max_length=10)
    conversion_unit = models.CharField(max_length=10, null=True, blank=True)


class DailyValueNutrient(models.Model):
    name = models.CharField(max_length=120, unique=True)
    unit = models.CharField(max_length=10)
    value = models.DecimalField(max_digits=8, decimal_places=2)
    nutrient = models.ForeignKey(Nutrient, null=True, blank=True, on_delete=models.CASCADE)


class DailyValueFoodComponent(models.Model):
    name = models.CharField(max_length=120, unique=True)
    unit = models.CharField(max_length=10)
    value = models.DecimalField(max_digits=8, decimal_places=2)
    nutrient = models.ForeignKey(Nutrient, null=True, blank=True, on_delete=models.CASCADE)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birth_date = models.DateField(null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    log = models.OneToOneField(
        "Log", related_name="profileLogMap", on_delete=models.CASCADE, null=True, blank=True, default=""
    )


class Log(models.Model):
    profile = models.OneToOneField(
        Profile, related_name="logProfileMap", on_delete=models.CASCADE, null=True, blank=True
    )


class Excercise(models.Model):
    excercise_name = models.CharField(max_length=25)
    met = models.DecimalField(max_digits=4, decimal_places=2)
    duration = models.IntegerField()
    calories_expended = models.IntegerField()
    excercise_day = models.DateField(default=date.today)
    excercise_time = models.TimeField()
    log = models.ManyToManyField(Log, related_name="excerciseLog")


class Meal(models.Model):
    food = models.CharField(max_length=120)
    unit = models.CharField(max_length=50)
    quantity = models.IntegerField()
    calories = models.IntegerField()
    weight = models.DecimalField(max_digits=6, decimal_places=2)
    meal_day = models.DateField(default=date.today)
    meal_time = models.TimeField()
    log = models.ManyToManyField(Log, related_name="mealLog")


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """create user profile and log when signal "post save" is received

    Args:
        sender (Model): User model
        instance (Object): User model instance
        created (boolean): has user been created
    """
    if created:
        profile = Profile.objects.create(user=instance)
        log = Log.objects.create()
        log.profile_id = profile.id
        log.save()


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
