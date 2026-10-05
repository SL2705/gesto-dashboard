from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services.wip_dashboard import build_dashboard_payload, build_stage_details_payload
from .services.wip_simulator import ensure_fresh_wip_data
from .wip_constants import FAMILY_STAGES


def _simulation_ttl() -> int:
    return getattr(settings, "WIP_SIMULATION_TTL_SECONDS", 20)


@api_view(["GET"])
def wip_dashboard(request, family):
    family = family.lower()
    if family not in FAMILY_STAGES:
        return Response({"success": False, "error": f"Unknown family '{family}'"}, status=404)

    ensure_fresh_wip_data(ttl_seconds=_simulation_ttl())

    payload = build_dashboard_payload(family)
    payload["success"] = True
    return Response(payload)


@api_view(["GET"])
def wip_stage_details(request, family, stage):
    family = family.lower()
    stage = stage.upper()

    if family not in FAMILY_STAGES:
        return Response({"success": False, "error": f"Unknown family '{family}'"}, status=404)
    if stage not in FAMILY_STAGES[family]:
        return Response(
            {"success": False, "error": f"Unknown stage '{stage}' for family '{family}'"},
            status=404,
        )

    ensure_fresh_wip_data(ttl_seconds=_simulation_ttl())

    payload = build_stage_details_payload(family, stage)
    payload["success"] = True
    return Response(payload)
