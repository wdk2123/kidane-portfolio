#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static files (CSS/JS/Images) for production
python manage.py collectstatic --no-input

# Sync the database
python manage.py migrate