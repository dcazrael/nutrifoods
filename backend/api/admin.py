from django.contrib import admin
from .models import Nutrient


class NutrientAdmin(admin.ModelAdmin):
    list_display = ("attr_id", "usda_tag", "name", "unit", "conversion_unit")


class Daily_valueAdmin(admin.ModelAdmin):
    list_display = ("name", "unit", "adults", "infants", "children", "nutritient_id")


# Register your models here.
admin.site.register(Nutrient, NutrientAdmin)
