# import os
# from pathlib import Path
# from datetime import timedelta
# import dj_database_url

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent

# # SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-=54a*z_b8c0@5nm8b^ox#)ssjz@g=&id=8f1&^32x1(8lpa0i2")

# # SECURITY WARNING: don't run with debug turned on in production!
# # Defaults to True for local development, but Vercel will set this to False
# DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

# # Allow Vercel domains and localhost
# ALLOWED_HOSTS = [".vercel.app", ".vercel-infra.com", "localhost", "127.0.0.1"]

# # Application definition
# INSTALLED_APPS = [
#     "django.contrib.admin",
#     "django.contrib.auth",
#     "django.contrib.contenttypes",
#     "django.contrib.sessions",
#     "django.contrib.messages",
#     "django.contrib.staticfiles",
#     "rest_framework",
#     "rest_framework_simplejwt",
#     "corsheaders",
#     "bookings",
# ]

# MIDDLEWARE = [
#     "corsheaders.middleware.CorsMiddleware",
#     "django.middleware.security.SecurityMiddleware",
#     "django.contrib.sessions.middleware.SessionMiddleware",
#     "django.middleware.common.CommonMiddleware",
#     "django.middleware.csrf.CsrfViewMiddleware",
#     "django.contrib.auth.middleware.AuthenticationMiddleware",
#     "django.contrib.messages.middleware.MessageMiddleware",
#     "django.middleware.clickjacking.XFrameOptionsMiddleware",
# ]

# ROOT_URLCONF = "config.urls"

# TEMPLATES = [
#     {
#         "BACKEND": "django.template.backends.django.DjangoTemplates",
#         "DIRS": [],
#         "APP_DIRS": True,
#         "OPTIONS": {
#             "context_processors": [
#                 "django.template.context_processors.debug",
#                 "django.template.context_processors.request",
#                 "django.contrib.auth.context_processors.auth",
#                 "django.contrib.messages.context_processors.messages",
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = "config.wsgi.application"

# # Database
# # Uses Neon PostgreSQL in production (via DATABASE_URL), falls back to SQLite locally
# DATABASES = {
#     "default": dj_database_url.config(
#         default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
#         conn_max_age=600,
#         conn_health_checks=True,
#     )
# }

# # Password validation
# AUTH_PASSWORD_VALIDATORS = [
#     {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
#     {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
#     {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
#     {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
# ]

# # Internationalization
# LANGUAGE_CODE = "en-us"
# TIME_ZONE = "Africa/Johannesburg"
# USE_TZ = True
# USE_I18N = True

# # CORS Settings
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "https://spotless-zeta.vercel.app", # Your live Vercel URL
# ]
# # Allows any Vercel preview deployment to access the API
# CORS_ALLOWED_ORIGIN_REGEXES = [
#     r"^https://.*\.vercel\.app$",
# ]

# # Static files (CSS, JavaScript, Images)
# STATIC_URL = "static/"
# STATIC_ROOT = BASE_DIR / "staticfiles"

# # REST Framework & JWT
# REST_FRAMEWORK = {
#     "DEFAULT_AUTHENTICATION_CLASSES": (
#         "rest_framework_simplejwt.authentication.JWTAuthentication",
#     ),
#     "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
# }

# SIMPLE_JWT = {
#     "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
# }

# # Email (Prints to console in dev)
# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# # Default primary key field type
# DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# # WORKING SETTINGS.PY BEFORE VERCEL DEPLOYMENT









import os
from pathlib import Path
from datetime import timedelta
from urllib.parse import parse_qs, unquote, urlparse
import dj_database_url # <-- ADD THIS


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-=54a*z_b8c0@5nm8b^ox#)ssjz@g=&id=8f1&^32x1(8lpa0i2")

# SECURITY WARNING: don't run with debug turned on in production!
# Defaults to True for local development, but Vercel will set this to False
DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

# Allow Vercel domains and localhost
ALLOWED_HOSTS = [".vercel.app", ".vercel-infra.com", "localhost", "127.0.0.1"]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "anymail",
    "bookings",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware", # <-- ADD THIS
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# Uses PostgreSQL in production (via DATABASE_URL), falls back to SQLite locally.
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    database_url = urlparse(DATABASE_URL)
    if database_url.scheme in ("postgres", "postgresql"):
        database_options = {
            key: values[-1] for key, values in parse_qs(database_url.query).items()
        }
        # Neon requires SSL
        database_options['sslmode'] = 'require' 
        
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": unquote(database_url.path.lstrip("/")),
                "USER": unquote(database_url.username or ""),
                "PASSWORD": unquote(database_url.password or ""),
                "HOST": database_url.hostname or "",
                "PORT": str(database_url.port or ""),
                "CONN_MAX_AGE": 600,
                "CONN_HEALTH_CHECKS": True,
                "OPTIONS": database_options,
            }
        }
    else:
        raise ValueError(f"Unsupported DATABASE_URL scheme: {database_url.scheme}")
else:
   DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Johannesburg"
USE_TZ = True
USE_I18N = True

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://spotless-zeta.vercel.app", 
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage" # <--- Check this


# REST Framework & JWT
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
}

EMAIL_BACKEND = "anymail.backends.resend.EmailBackend"

ANYMAIL = {
    "RESEND_API_KEY": os.environ.get("RESEND_API_KEY"),
}

# This is the "From" address your clients will see
DEFAULT_FROM_EMAIL = "Spotless <onboarding@resend.dev>" 

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"