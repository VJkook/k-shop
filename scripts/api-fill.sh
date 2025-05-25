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


# Готовые торты
echo "Добавляем готовые торты..."
make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Малиново-клубничный",
    "description": "Красивый торт с малиной, клубникой и цветами в украшениях",
    "price": 2300,
    "weight": 1.2
}'

make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Торт на день рождения",
    "description": "Идейный торт, который не только вкусный, а ещё удивит своим внешним видом!",
    "price": 2100,
    "weight": 1.1
}'

make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Бенто торт и давно тебе 17",
    "description": "Вкусный торт с Эдвардом Каленом!",
    "price": 2000,
    "weight": 0.6
}'

make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Торт с человеком пауком",
    "price": 2500,
    "weight": 1.2
}'

make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Торт на свадьбу: Сказочный замок",
    "price": 8000,
    "weight": 6.12
}'

make_request 'http://localhost:8000/api/ready-cakes' 'POST' '{
    "name": "Торт свадебный с бабочками",
    "price": 3100,
    "weight": 2.51
}'

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/cake1.jpg"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/pensia-blizko.jpg"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/Bento-tort-i-davno-tebe-17.jpg"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/tort-s-chelovekom-paukom.jpg"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/tort-na-svadbu-skazochnyy-zamok.jpg"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/tort-na-svadbu-s-babochkami.jpg"' \
--cookie $COOKIE_FILE

# Связи изображений с тортами
echo "Связываем изображения с тортами..."
make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 1,
    "id_ready_cake": 1
}'

make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 2,
    "id_ready_cake": 2
}'

make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 3,
    "id_ready_cake": 3
}'

make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 4,
    "id_ready_cake": 4
}'

make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 5,
    "id_ready_cake": 5
}'

make_request 'http://localhost:8000/api/ready-cake-image-relations/' 'POST' '{
    "id_image": 6,
    "id_ready_cake": 6
}'


echo "Загружаем начинки..."
curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/начинки/красный бархат.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/начинки/медовик с грецким орехом.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/начинки/сникерс.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/начинки/тропическая.png"' \
--cookie $COOKIE_FILE


# Начинки
echo "Добавляем начинки..."
make_request 'http://localhost:8000/api/fillings' 'POST' '{
    "name": "Красный бархат",
    "price_by_kg": 2300,
    "id_image": 7
}'

make_request 'http://localhost:8000/api/fillings' 'POST' '{
    "name": "Медовик с грецким орехом",
    "price_by_kg": 2100,
    "id_image": 8
}'

make_request 'http://localhost:8000/api/fillings' 'POST' '{
    "name": "Сниккерс",
    "price_by_kg": 1800,
    "id_image": 9
}'

make_request 'http://localhost:8000/api/fillings' 'POST' '{
    "name": "Тропическа",
    "price_by_kg": 2600,
    "id_image": 10
}'

# Покрытия
echo "Добавляем покрытия..."

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/покрытия/велюр.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/покрытия/глазурь.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/покрытия/крем чиз.png"' \
--cookie $COOKIE_FILE

make_request 'http://localhost:8000/api/coverages' 'POST' '{
    "name": "Велюр",
    "price": 200,
    "id_image": 11
}'

make_request 'http://localhost:8000/api/coverages' 'POST' '{
    "name": "Глазурь",
    "price": 200,
    "id_image": 12
}'

make_request 'http://localhost:8000/api/coverages' 'POST' '{
    "name": "Крем-чиз",
    "price": 300,
    "id_image": 13
}'

# Украшения
echo "Добавляем украшения..."

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/декор/безе на палочке.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/декор/цветы из крема.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/декор/карамель.png"' \
--cookie $COOKIE_FILE

curl --location 'http://localhost:8000/api/images' \
--form 'image=@"'$SCRIPT_DIR'/images/декор/ягоды.png"' \
--cookie $COOKIE_FILE

make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Безе на палочке",
    "price": 50,
    "id_image": 14
}'

make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Цветы из крема",
    "price": 300,
    "id_image": 15
}'

make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Карамель",
    "price": 250,
    "id_image": 16
}'

make_request 'http://localhost:8000/api/decors' 'POST' '{
    "name": "Ягоды",
    "price": 500,
    "id_image": 17
}'

# Формы
echo "Добавляем формы..."
make_request 'http://localhost:8000/api/cake-forms' 'POST' '{
    "name": "Квадратная"
}'

make_request 'http://localhost:8000/api/cake-forms' 'POST' '{
    "name": "Круглая"
}'



echo "Все данные успешно добавлены!"
