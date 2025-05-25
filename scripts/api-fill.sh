#!/bin/bash

# Определяем директорию, где лежит скрипт
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $SCRIPT_DIR

# Файл для хранения cookies
COOKIE_FILE="cookies.txt"

# Регистрация пользователя и сохранение cookie
echo "Регистрируем пользователя..."
REGISTER_RESPONSE=$(curl --silent --location 'http://localhost:8000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "admin",
    "email": "admin@gmail.com",
    "password": "123456789"
}' \
--cookie-jar $COOKIE_FILE)

echo "Регистрация завершена. Cookie сохранены в $COOKIE_FILE"

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

# Загрузка изображений (не требует cookie)
echo "Загружаем изображения..."
curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/cake1.jpg"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/strawbery-scaled.jpg"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/бабочки.jpg"' \
--cookie $COOKIE_FILE

# Начинки
echo "Добавляем начинки..."
make_request 'http://localhost:8000/api/fillings' 'POST' '{
    "name": "Клубничная",
    "price_by_kg": 15.20,
    "id_image": 2
}'

make_request 'http://localhost:8000/api/fillings' 'POST' '{
    "name": "Малиновая",
    "price_by_kg": 15.20,
    "id_image": 2
}'

# Покрытия
echo "Добавляем покрытия..."
make_request 'http://localhost:8000/api/coverages' 'POST' '{
    "name": "Клубничная",
    "price": 10.50,
    "id_image": 2
}'

# Украшения
echo "Добавляем украшения..."
make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Клубничный декор",
    "price": 10.50,
    "id_image": 2
}'

make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Бабочки",
    "price": 10.50,
    "id_image": 3
}'

make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Бабочки",
    "price": 10.50,
    "id_image": 3
}'

make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Бабочки",
    "price": 10.50,
    "id_image": 3
}'

# Формы
echo "Добавляем формы..."
make_request 'http://localhost:8000/api/cake-forms' 'POST' '{
    "name": "Квадратная"
}'

make_request 'http://localhost:8000/api/cake-forms' 'POST' '{
    "name": "Круглая"
}'

# Готовые торты
echo "Добавляем готовые торты..."
make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Клубничный",
    "price": 15.20,
    "weight": 2.20
}'

make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Клубничный 2",
    "price": 30.20,
    "weight": 2.20
}'

# Связи изображений с тортами
echo "Связываем изображения с тортами..."
make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 1,
    "id_ready_cake": 1
}'

make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 1,
    "id_ready_cake": 2
}'

echo "Все данные успешно добавлены!"
