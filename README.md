# gesto-dashboard

**Developers:**
- Luis Ruiz
- Victorino Triana
- Jonathan Olvera

Dashboard full-stack para **trackeo de producción en tiempo real — Work In Process (WIP)**, construido con **Django REST Framework** (backend) y **React + Vite** (frontend).

---

## 🏗️ Arquitectura

```
gesto-dashboard/
├── backend/          # Configuración Django (settings, urls, wsgi/asgi)
├── miapi/            # App Django (API REST)
├── frontend/         # Cliente React (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   └── assets/
│   ├── public/
│   └── package.json
├── venv/             # (no versionado)
├── db.sqlite3        # (no versionado)
├── manage.py
├── .gitignore
└── README.md
```

- **Backend:** Django 6 + Django REST Framework + django-cors-headers
- **Frontend:** React + Vite + Axios
- **Comunicación:** HTTP/JSON mediante API REST en `http://127.0.0.1:8000/api/`

---

## 🚀 Requisitos previos

- Python 3.12+
- Node.js 20+ y npm
- Git

---

## 🔧 Instalación (Backend)

```bash
# 1. Clonar el repositorio
git clone https://github.com/SL2705/gesto-dashboard.git
cd gesto-dashboard

# 2. Crear entorno virtual
python -m venv venv

# Windows (PowerShell)
venv\Scripts\activate
# Mac / Linux
# source venv/bin/activate

# 3. Instalar dependencias
pip install django djangorestframework django-cors-headers

# 4. Aplicar migraciones
python manage.py migrate

# 5. Correr servidor de desarrollo
python manage.py runserver   # → http://127.0.0.1:8000/
```

---

## 🔧 Instalación (Frontend)

```bash
# 1. Entrar a la carpeta del frontend
cd frontend

# 2. Instalar dependencias de Node
npm install

# 3. Instalar Axios (cliente HTTP para consumir la API)
npm install axios

# 4. Correr servidor de desarrollo
npm run dev   # → http://localhost:5173/
```

---

## 🧑‍💻 Flujo de trabajo diario

Necesitas **dos terminales** abiertas simultáneamente:

| Terminal 1 — Backend            | Terminal 2 — Frontend           |
|---------------------------------|---------------------------------|
| `venv\Scripts\activate`         | `cd frontend`                   |
| `python manage.py runserver`    | `npm run dev`                   |
| → http://127.0.0.1:8000/        | → http://localhost:5173/        |

---

## 🔌 Endpoints actuales

| Método | URL          | Descripción                            |
|--------|--------------|----------------------------------------|
| GET    | `/api/hola/` | Endpoint de prueba (Hola Mundo)        |

### Ejemplo de respuesta

```json
{
  "mensaje": "¡Hola desde el backend de Django!"
}
```

---

## 🧪 Verificar la conexión Frontend ↔ Backend

1. Levanta Django en la terminal 1 → `http://127.0.0.1:8000/api/hola/`
2. Levanta React en la terminal 2 → `http://localhost:5173/`
3. En el navegador deberías ver, dentro de la página de Vite, el mensaje verde:
   > 🐍 **¡Hola desde el backend de Django!**

Si aparece un error de CORS, revisa `backend/settings.py`:
- `corsheaders` en `INSTALLED_APPS`
- `corsheaders.middleware.CorsMiddleware` al inicio de `MIDDLEWARE`
- `CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]`

---

## 🌿 Flujo de trabajo Git

- `main` → rama estable, lista para entrega.
- Ramas de feature por desarrollador: `luis_branch`, `victorino_branch`, `jonathan_branch`.
- Los cambios se integran mediante **Pull Requests** hacia `main`.

### Comandos típicos

```bash
# Crear tu rama de trabajo
git checkout -b nombre_branch

# Guardar avances
git add .
git commit -m "feat: descripción del cambio"
git push -u origin nombre_branch

# Merge a main (vía Pull Request en GitHub o local)
git checkout main
git pull origin main
git merge nombre_branch
git push origin main
```

---

## 📌 Estado del proyecto

- [x] Backend Django con DRF configurado
- [x] CORS habilitado para `localhost:5173`
- [x] Frontend React consumiendo endpoint de prueba
- [ ] Modelo `Gesto` + endpoints CRUD
- [ ] Componentes de listado y creación de gestos
- [ ] Dashboard de WIP en tiempo real
- [ ] Autenticación de usuarios (opcional)

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia incluida en el archivo `LICENSE`.