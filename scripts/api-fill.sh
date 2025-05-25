#!/bin/bash

# Определяем директорию, где лежит скрипт
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $SCRIPT_DIR

curl --location 'http://localhost:8000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "nikita2015borisov@gmail.com",
    "password": "123456789"
}'

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/cake1.jpg"'

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/strawbery-scaled.jpg"'

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/бабочки.jpg"'

# начинки
curl --location 'http://localhost:8000/api/fillings' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Клубничная",
    "price_by_kg": 15.20,
    "id_image": 2
}'

curl --location 'http://localhost:8000/api/fillings' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Малиновая",
    "price_by_kg": 15.20,
    "id_image": 2
}'

# покрытия
curl --location 'http://localhost:8000/api/coverages' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Клубничная",
    "price": 10.50,
    "id_image": 2
}'

# украшения
curl --location 'http://localhost:8000/api/decors' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Клубничный декор",
    "price": 10.50,
    "id_image": 2
}'

curl --location 'http://localhost:8000/api/decors' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Бабочки",
    "price": 10.50,
    "id_image": 3
}'

curl --location 'http://localhost:8000/api/decors' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Бабочки",
    "price": 10.50,
    "id_image": 3
}'

curl --location 'http://localhost:8000/api/decors' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Бабочки",
    "price": 10.50,
    "id_image": 3
}'

# формы
curl --location 'http://localhost:8000/api/cake-forms' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Квадратная"
}'

curl --location 'http://localhost:8000/api/cake-forms' \
--header 'Content-Type: application/json'  \
--data '{
    "name": "Круглая"
}'

# ready-cakes

curl --location 'http://localhost:8000/api/ready-cakes' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Клубничный",
    "price": 15.20,
    "weight": 2.20
}'

curl --location 'http://localhost:8000/api/ready-cakes' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Клубничный 2",
    "price": 30.20,
    "weight": 2.20
}'

curl --location 'http://localhost:8000/api/ready-cake-image-relations/' \
--header 'Content-Type: application/json' \
--data '{
    "id_image": 1,
    "id_ready_cake": 1
}'

curl --location 'http://localhost:8000/api/ready-cake-image-relations/' \
--header 'Content-Type: application/json' \
--data '{
    "id_image": 1,
    "id_ready_cake": 2
}'

# создать пользователя
curl --location 'http://localhost:8000/api/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "nikita",
    "email": "nikita2015borisov@gmail.com",
    "password": "123456789"
}'
