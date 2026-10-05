"""Construye los payloads de la API de WIP a partir de WipUnit.

Toda la lógica aquí es genérica por familia: un único camino de código sirve
tanto a "proyecto_a" como a "proyecto_b" (y a cualquier familia nueva que se
agregue a wip_constants.FAMILY_STAGES), a diferencia del sistema legado que
duplicaba cada función por familia.
"""
from collections import Counter

from django.db.models import Count

from ..models import WipUnit
from ..wip_constants import FAMILY_LABELS, FAMILY_STAGES

TOP_STAY_TIME_LIMIT = 15


def build_dashboard_payload(family: str) -> dict:
    stage_order = FAMILY_STAGES[family]
    units = WipUnit.objects.filter(family=family)

    stage_counts = {stage: 0 for stage in stage_order}
    for row in units.values("stage").annotate(count=Count("id")):
        if row["stage"] in stage_counts:
            stage_counts[row["stage"]] = row["count"]

    status_counts = {"testing": 0, "failed": 0, "offline": 0}
    for row in units.values("status").annotate(count=Count("id")):
        key = row["status"].lower()
        if key in status_counts:
            status_counts[key] = row["count"]

    sku_counter = Counter(units.values_list("sku_model", flat=True))
    sku_models = [
        {"sku_model": sku_model, "count": count}
        for sku_model, count in sorted(sku_counter.items(), key=lambda item: (-item[1], item[0]))
    ]

    failed_by_stage = []
    for stage in stage_order:
        failed_qs = units.filter(stage=stage, status="Failed")
        failed_count = failed_qs.count()
        if failed_count == 0:
            continue

        top_error_rows = Counter(
            failed_qs.exclude(error_description="").values_list("error_description", flat=True)
        ).most_common(1)

        failed_by_stage.append({
            "stage": stage,
            "failed_count": failed_count,
            "top_error": top_error_rows[0][0] if top_error_rows else "",
        })

    top_stay_time = list(
        units.order_by("-stay_time_minutes")[:TOP_STAY_TIME_LIMIT]
        .values("usn", "model_name", "sku_model", "stage", "status", "stay_time_minutes")
    )

    wip_total = sum(stage_counts.values())

    return {
        "family": family,
        "family_label": FAMILY_LABELS[family],
        "stage_order": stage_order,
        "wip_total": wip_total,
        "stages": stage_counts,
        "sku_models": sku_models,
        "sku_model_total": sum(item["count"] for item in sku_models),
        "status_summary": status_counts,
        "failed_by_stage": failed_by_stage,
        "top_stay_time": top_stay_time,
    }


def build_stage_details_payload(family: str, stage: str) -> dict:
    units = list(
        WipUnit.objects.filter(family=family, stage=stage)
        .order_by("-stay_time_minutes")
        .values(
            "usn", "model_name", "sku_model", "mo", "upn",
            "status", "pod", "stay_time_minutes", "created_at",
        )
    )

    return {
        "family": family,
        "stage": stage,
        "count": len(units),
        "units": units,
    }
