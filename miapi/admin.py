from django.contrib import admin

from .models import WipGenerationMeta, WipUnit


@admin.register(WipUnit)
class WipUnitAdmin(admin.ModelAdmin):
    list_display = ("usn", "family", "stage", "status", "sku_model", "stay_time_minutes", "created_at")
    list_filter = ("family", "stage", "status")
    search_fields = ("usn", "mo", "upn", "sku_model")


@admin.register(WipGenerationMeta)
class WipGenerationMetaAdmin(admin.ModelAdmin):
    list_display = ("id", "last_generated_at")
