# Настройки подключения к PostgreSQL в Docker
DOCKER_CONTAINER = pgsql
PG_IMAGE = postgres:17
PGDATABASE = k-shop
PGUSER = sail
PGPASSWORD = password

# Команда для выполнения psql внутри контейнера
PSQL_CMD = docker compose exec -e PGPASSWORD=$(PGPASSWORD) $(DOCKER_CONTAINER) psql -U $(PGUSER) -d $(PGDATABASE)

default: help

include .env
export $(shell sed 's/=.*//' .env)

front-url:
	@echo $(FRONT_URL)

echo:
	@echo $(PWD)

install-vendor:
	@docker run --rm \
		-u "$(id -u):$(id -g)" \
		-v "$(PWD):/var/www/html" \
		-w /var/www/html \
		laravelsail/php83-composer:latest \
    	composer install --ignore-platform-reqs

up:
	@docker compose up -d
	@sleep 3
	@docker compose exec app php artisan migrate
	@make optimize
	@docker compose exec app bash -c "cd frontend && npm i --legacy-peer-deps"
	@docker compose exec -d app bash -c "cd frontend && npm run dev"
	@echo FRONT_URL: $(FRONT_URL)

down:
	#Погасить frontend
	@docker compose exec app killall -9 node
	@docker compose down

restart:
	#Погасить frontend
	@docker compose down
	@make up

stop:
	@docker compose exec app killall -9 node
	@docker compose stop

help:
	@echo "Доступные команды:"
	@echo "  connect      - Интерактивное подключение к PostgreSQL"
	@echo "  select-users - Вывести всех пользователей"
	@echo "  describe-users - Показать структуру таблицы users"
	@echo "  start-db     - Запустить контейнер с PostgreSQL"
	@echo "  stop-db      - Остановить контейнер"

optimize:
	@docker compose exec app php artisan optimize
	@docker compose exec app php artisan cache:clear
	@docker compose exec app php artisan config:clear
	@docker compose exec app php artisan config:cache
	@docker compose exec app php artisan view:clear

# Интерактивное подключение
connect:
	@$(PSQL_CMD)

refill-db:
	@make optimize
	@docker compose exec app php artisan db:wipe
	@docker compose exec app php artisan migrate
	@make fill-db
	@echo "\n"
	@echo "Пересборка завершена"

fill-db:
	@make insert-roles
	@make insert-users
	@make insert-payment-statuses
	@make insert-order-statutes
	@make insert-max-time
	@make register-users
	@make update-users
	@make insert-address
	@make fill-by-api
	@make insert-ingredients
	@./scripts/add-recipes.sh

register-users:
	@echo "Заполнение по api:----------------------------------------------------------"
	./scripts/register-users.sh

fill-by-api:
	@echo "Заполнение по api:----------------------------------------------------------"
	./scripts/api-fill.sh

# Выборка данных из таблицы users
select-users:
	@echo "Содержимое таблицы users:"
	@$(PSQL_CMD) -c "SELECT * FROM users;"

insert-roles:
	@echo "Заполнение таблицы roles:"
	@$(PSQL_CMD) -c "INSERT INTO public.roles (name) VALUES ('admin'), ('client'), ('confectioner')"

insert-users:
	@echo "Заполнение таблицы users:"
	@$(PSQL_CMD) -c "INSERT INTO public.users (name, email, email_verified_at, password, remember_token, created_at, updated_at, id_role) VALUES ('marina', 'test@test.ru', null, '123', null, null, null, 1)"

update-users:
	@$(PSQL_CMD) -c "UPDATE public.users SET id_role = 1::bigint WHERE name = 'admin'"
	@$(PSQL_CMD) -c "UPDATE public.users SET id_role = 3::bigint WHERE email = 'confectioner@gmail.com'"
	@$(PSQL_CMD) -c "UPDATE public.users SET id_role = 3::bigint WHERE email = 'confectioner2@gmail.com'"
	@$(PSQL_CMD) -c "UPDATE public.users SET id_role = 3::bigint WHERE email = 'confectioner3@gmail.com'"

insert-address:
	@echo "Заполнение таблицы delivery_addresses:"
	@$(PSQL_CMD) -c "INSERT INTO public.delivery_addresses (id, address, comment, index, id_user) VALUES (DEFAULT, 'Kirov', null, null, 1)"
	@$(PSQL_CMD) -c "INSERT INTO public.delivery_addresses (id, address, comment, index, id_user) VALUES (DEFAULT, 'Kirov', null, null, 5)"

insert-payment-statuses:
	@echo "Заполнение таблицы payment_statuses:"
	@$(PSQL_CMD) -c "INSERT INTO public.payment_statuses (name) VALUES ('Ожидание оплаты')"

insert-order-statutes:
	@echo "Заполнение таблицы order_statuses:"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (name, color) VALUES ('Ожидание подтверждения', 'blue')"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (name, color) VALUES ('Готовится', 'yellow')"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (name, color) VALUES ('Подтверждён', 'orange')"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (name, color) VALUES ('В доставке', 'black')"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (name, color) VALUES ('Доставлен', 'green')"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (name, color) VALUES ('Отменён', 'red')"

insert-max-time:
	@echo "Заполнение таблицы max_time_for_cooking:"
	@$(PSQL_CMD) -c "INSERT INTO public.max_time_for_cooking (time) VALUES ('18:00:00')"

insert-ingredients:
	@echo 'Заполнение таблицы ingredients:'
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Молоко', 'Литры')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Яйцо', 'Штуки')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Изюм', 'Кг')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Малина', 'Кг')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Клубника', 'Кг')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Мука пшеничная', 'Кг')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Сахар', 'Кг')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Какао-порошок', 'Граммы')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Сливочное масло', 'Граммы')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Растительное масло', 'Мл')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Пахта', 'Мл')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Краситель красный пищевой', 'Мл')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Уксус', 'Мл')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Сода', 'Граммы')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Соль', 'Граммы')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Ванильный экстракт', 'Мл')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Сливочный сыр', 'Граммы')"
	@$(PSQL_CMD) -c "INSERT INTO public.ingredients (name, measurement) VALUES ('Сахарная пудра', 'Граммы')"

# Описание таблицы users
describe-users:
	@echo "Структура таблицы users:"
	@$(PSQL_CMD) -c "\d users"


.PHONY: help connect select-users describe-users start-db stop-db
