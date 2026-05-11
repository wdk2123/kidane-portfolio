#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Build step should not depend on database connectivity.
python manage.py collectstatic --noinput

# This line creates the admin user automatically using the Env Variables
if [ "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py createsuperuser --noinput || true
fi