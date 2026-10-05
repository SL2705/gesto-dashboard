"""Configuración fija de familias de producto y catálogos usados por el simulador de WIP.

Este módulo es la única fuente de verdad sobre qué stages y SKUs existen por
familia. Tanto el simulador (wip_simulator) como el agregador (wip_dashboard)
leen de aquí en lugar de tener listas duplicadas por familia.

Para agregar o renombrar una familia, solo se edita este archivo (y su espejo
en el frontend: frontend/src/wip/constants.js) — el resto del código (modelos,
servicios, vistas, componentes) es genérico y no tiene nombres de familia
escritos a mano.
"""

FAMILY_STAGES = {
    "proyecto_a": ["WO", "WP", "WT", "NH", "NX", "UA", "N2", "TP", "NI"],
    "proyecto_b": ["WT", "NH", "NX", "UA", "N2", "TP", "NI"],
}

FAMILY_LABELS = {
    "proyecto_a": "PROYECTO A",
    "proyecto_b": "PROYECTO B",
}

FAMILY_MODEL_NAME = {
    "proyecto_a": "PROYECTO A",
    "proyecto_b": "PROYECTO B",
}

FAMILY_SKU_POOL = {
    "proyecto_a": [
        "Proyecto A Config1",
        "Proyecto A Config2",
        "Proyecto A Config3",
        "Proyecto A Config4",
        "Proyecto A Config5",
    ],
    "proyecto_b": [
        "Proyecto B Config1",
        "Proyecto B Config2",
        "Proyecto B Config3",
    ],
}

STATUS_CHOICES = ["Testing", "Failed", "Offline"]

# Pesos relativos para random.choices (deben alinearse 1:1 con STATUS_CHOICES).
STATUS_WEIGHTS = [0.75, 0.10, 0.15]

ERROR_POOL = [
    ("E101", "Sensor timeout"),
    ("E204", "Voltage out of range"),
    ("E310", "Firmware mismatch"),
    ("E450", "Thermal shutdown"),
    ("E512", "Communication lost with tester"),
]

STAGE_UNIT_COUNT_RANGE = (4, 35)

STAY_TIME_RANGE_MINUTES = (2, 540)
# Moda de la distribución triangular: la mayoría de unidades permanecen poco tiempo.
STAY_TIME_MODE_MINUTES = 40
