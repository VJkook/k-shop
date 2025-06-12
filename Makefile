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
	@make install-vendor
	@docker compose up -d
	@sleep 2
	@docker compose exec app php artisan migrate
	@docker compose exec app php artisan optimize
	@docker compose exec app php artisan cache:clear
	@docker compose exec app php artisan config:clear
	@docker compose exec app php artisan config:cache
	@docker compose exec app php artisan view:clear
	@docker compose exec app bash -c "cd frontend && npm i --legacy-peer-deps"
	@docker compose exec -d app bash -c "cd frontend && npm run dev"
	@echo FRONT_URL: $(FRONT_URL)

restart:
	@docker compose down
	@make up


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
	@echo "Пересборка завершена"

fill-db:
	@make insert-roles
	@make insert-users
	@make insert-address
	@make insert-payment-statuses
	@make insert-order-statutes
	@make insert-max-time
	@make register-users
	@make update-users
	@make fill-by-api

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
	@$(PSQL_CMD) -c "INSERT INTO public.users (name, email, email_verified_at, password, remember_token, created_at, updated_at, id_role) VALUES ('Вася', 'test2@test.ru', null, '123', null, null, null, 3)"
	@$(PSQL_CMD) -c "INSERT INTO public.users (name, email, email_verified_at, password, remember_token, created_at, updated_at, id_role) VALUES ('Петя', 'test3@test.ru', null, '123', null, null, null, 3)"
	@$(PSQL_CMD) -c "INSERT INTO public.users (name, email, email_verified_at, password, remember_token, created_at, updated_at, id_role) VALUES ('Коля', 'test4@test.ru', null, '123', null, null, null, 3)"

update-users:
	@$(PSQL_CMD) -c "UPDATE public.users SET id_role = 1::bigint WHERE name = 'admin'"

insert-address:
	@echo "Заполнение таблицы delivery_addresses:"
	@$(PSQL_CMD) -c "INSERT INTO public.delivery_addresses (id, address, comment, index, id_user) VALUES (DEFAULT, 'Kirov', null, null, 1)"

insert-payment-statuses:
	@echo "Заполнение таблицы payment_statuses:"
	@$(PSQL_CMD) -c "INSERT INTO public.payment_statuses (name) VALUES ('Ожидание оплаты')"

insert-order-statutes:
	@echo "Заполнение таблицы order_statuses:"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (name) VALUES ('Ожидание подтверждения'), ('Готовится')"

insert-max-time:
	@echo "Заполнение таблицы order_statuses:"
	@$(PSQL_CMD) -c "INSERT INTO public.max_time_for_cooking (time) VALUES ('18:00:00')"

# Описание таблицы users
describe-users:
	@echo "Структура таблицы users:"
	@$(PSQL_CMD) -c "\d users"


.PHONY: help connect select-users describe-users start-db stop-db
