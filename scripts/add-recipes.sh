#!/bin/bash

# Определяем директорию, где лежит скрипт
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $SCRIPT_DIR

# Файл для хранения cookies
COOKIE_FILE="cookies.txt"

# Авторизация пользователя и сохранение cookie
echo "Авторизуем пользователя..."
REGISTER_RESPONSE=$(curl --silent --location 'http://localhost:8000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "admin",
    "email": "admin@gmail.com",
    "password": "123456789"
}' \
--cookie-jar $COOKIE_FILE)

echo "Авторизация завершена. Cookie сохранены в $COOKIE_FILE"


# Функция для выполнения запросов с cookie
make_request() {
    local url=$1
    local method=$2
    local data=$3

    curl --location "$url" \
    --header 'Content-Type: application/json' \
    --cookie $COOKIE_FILE \
    --data-raw "$data"
}

echo "Создание рецептов"
make_request 'http://localhost:8000/api/recipes/ready-cakes' 'POST' '{
     "name": "Рецепт приготовление вкусного тортика",
     "description": "Рецепт для приготовления вкусного тортика",
     "id_ready_cake": 1
 }'

make_request 'http://localhost:8000/api/recipes/fillings' 'POST' '{
  "name": "Рецепт приготовления начинки",
  "description": "Рецепт приготовления вкусной начинки",
  "id_filling": 1
}'

make_request 'http://localhost:8000/api/recipes/decors' 'POST' '{
  "name": "Рецепт приготовления декора",
  "description": "Рецепт приготовления красивого и вкусного декора",
  "id_decor": 1
}'
