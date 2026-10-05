"""Algoritmo que genera, de forma aleatoria pero plausible, el WIP ficticio.

Se usa mientras el backend real (MIC SOAP / FusionEye) no está integrado.
Cada ciclo (controlado por WIP_SIMULATION_TTL_SECONDS) se reemplaza por
completo el contenido de WipUnit con nuevas cantidades aleatorias por stage,
para que el dashboard se sienta "en vivo" sin depender de ningún sistema externo.
"""
import random
from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from ..models import WipGenerationMeta, WipUnit
from ..wip_constants import (
    ERROR_POOL,
    FAMILY_MODEL_NAME,
    FAMILY_SKU_POOL,
    FAMILY_STAGES,
    STAGE_UNIT_COUNT_RANGE,
    STATUS_CHOICES,
    STATUS_WEIGHTS,
    STAY_TIME_MODE_MINUTES,
    STAY_TIME_RANGE_MINUTES,
)


def _build_unit(family: str, stage: str, index: int) -> WipUnit:
    status = random.choices(STATUS_CHOICES, weights=STATUS_WEIGHTS, k=1)[0]

    stay_min, stay_max = STAY_TIME_RANGE_MINUTES
    stay_time = int(random.triangular(stay_min, stay_max, STAY_TIME_MODE_MINUTES))

    error_code, error_description = "", ""
    if status == "Failed":
        error_code, error_description = random.choice(ERROR_POOL)

    pod = f"POD-{random.choice('ABCD')}{random.randint(1, 24):02d}" if status == "Testing" else status

    return WipUnit(
        family=family,
        usn=f"SIM{family[:2].upper()}{stage}{index:04d}{random.randint(0, 99):02d}",
        model_name=FAMILY_MODEL_NAME[family],
        sku_model=random.choice(FAMILY_SKU_POOL[family]),
        mo=f"MO{random.randint(100000, 999999)}",
        upn=str(random.randint(10 ** 11, 10 ** 12 - 1)),
        stage=stage,
        status=status,
        pod=pod,
        error_code=error_code,
        error_description=error_description,
        stay_time_minutes=stay_time,
    )


def generate_all_families() -> None:
    """Reconstruye por completo el WIP simulado para todas las familias configuradas."""
    new_units = []
    index = 0

    for family, stages in FAMILY_STAGES.items():
        for stage in stages:
            count = random.randint(*STAGE_UNIT_COUNT_RANGE)
            for _ in range(count):
                index += 1
                new_units.append(_build_unit(family, stage, index))

    with transaction.atomic():
        WipUnit.objects.all().delete()
        WipUnit.objects.bulk_create(new_units)
        WipGenerationMeta.objects.update_or_create(pk=1, defaults={})


def ensure_fresh_wip_data(ttl_seconds: int) -> None:
    """Regenera el WIP simulado si los datos actuales ya superaron el TTL configurado."""
    meta = WipGenerationMeta.objects.filter(pk=1).first()

    if meta is None:
        generate_all_families()
        return

    age = timezone.now() - meta.last_generated_at
    if age > timedelta(seconds=ttl_seconds):
        generate_all_families()
