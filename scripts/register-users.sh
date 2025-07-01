#!/bin/bash

# Определяем директорию, где лежит скрипт
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $SCRIPT_DIR

curl --location 'http://localhost:8000/api/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Вася",
    "email": "confectioner@gmail.com",
    "password": "123456789"
}'

curl --location 'http://localhost:8000/api/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "admin",
    "email": "admin@gmail.com",
    "password": "123456789"
}'

curl --location 'http://localhost:8000/api/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "client",
    "email": "client@gmail.com",
    "password": "123456789"
}'

curl --location 'http://localhost:8000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@gmail.com",
    "password": "123456789"
}'
