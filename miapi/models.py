from django.db import models

from .wip_constants import FAMILY_STAGES, STATUS_CHOICES


class WipGenerationMeta(models.Model):
    """Fila única (pk=1) que registra cuándo se regeneró por última vez el WIP simulado."""

    last_generated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "wip_simulation_state"

    def __str__(self):
        return f"WipGenerationMeta(last_generated_at={self.last_generated_at})"


class WipUnit(models.Model):
    """Una unidad simulada dentro del WIP.

    La tabla completa se reconstruye periódicamente (ver services/wip_simulator.py)
    en lugar de mutar filas individuales: así el payload del dashboard es siempre
    una foto consistente de "el WIP en este instante".
    """

    family = models.CharField(max_length=20, choices=[(key, key) for key in FAMILY_STAGES])
    usn = models.CharField(max_length=40)
    model_name = models.CharField(max_length=60)
    sku_model = models.CharField(max_length=80)
    mo = models.CharField(max_length=40)
    upn = models.CharField(max_length=40)
    stage = models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=[(status, status) for status in STATUS_CHOICES])
    pod = models.CharField(max_length=40, blank=True, default="")
    error_code = models.CharField(max_length=20, blank=True, default="")
    error_description = models.CharField(max_length=120, blank=True, default="")
    stay_time_minutes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "wip_units"
        indexes = [
            models.Index(fields=["family", "stage"]),
            models.Index(fields=["family", "status"]),
        ]

    def __str__(self):
        return f"{self.usn} ({self.family}/{self.stage})"
