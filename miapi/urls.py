from django.urls import path

from .views import hola_mundo
from .wip_views import wip_dashboard, wip_stage_details

urlpatterns = [
    path("hola/", hola_mundo),
    path("wip/dashboard/<str:family>/", wip_dashboard),
    path("wip/stage-details/<str:family>/<str:stage>/", wip_stage_details),
]
