#!/usr/bin/env bash
set -o errexit

# Ensure DB schema exists (Render free tier: no interactive shell)
python manage.py migrate --noinput

# Static files (safe to run multiple times)
python manage.py collectstatic --noinput

exec gunicorn portfolio.wsgi:application --bind 0.0.0.0:${PORT:-8000}
