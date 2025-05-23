# Настройки подключения к PostgreSQL в Docker
DOCKER_CONTAINER = pgsql
PG_IMAGE = postgres:17
PGDATABASE = k-shop
PGUSER = sail
PGPASSWORD = password

# Команда для выполнения psql внутри контейнера
PSQL_CMD = docker compose exec -e PGPASSWORD=$(PGPASSWORD) $(DOCKER_CONTAINER) psql -U $(PGUSER) -d $(PGDATABASE)

default: help

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
	@docker compose exec app php artisan migrate:reset
	@docker compose exec app php artisan migrate
	@make fill-db
	@echo "Пересборка завершена"

fill-db:
	@make insert-roles
	@make insert-user
	@make insert-address
	@make insert-payment-statuses
	@make insert-order-statutes
	@make fill-by-api

fill-by-api:
	@echo "Заполнение по api:----------------------------------------------------------"
	./scripts/api-fill.sh

# Выборка данных из таблицы users
select-users:
	@echo "Содержимое таблицы users:"
	@$(PSQL_CMD) -c "SELECT * FROM users;"

insert-roles:
	@echo "Заполнение таблицы roles:"
	@$(PSQL_CMD) -c "INSERT INTO public.roles (name) VALUES ('admin'), ('client')"

insert-user:
	@echo "Заполнение таблицы users:"
	@$(PSQL_CMD) -c "INSERT INTO public.users (name, email, email_verified_at, password, remember_token, created_at, updated_at, id_role) VALUES ('marina', 'test@test.ru', null, '123', null, null, null, 1)"

insert-address:
	@echo "Заполнение таблицы delivery_addresses:"
	@$(PSQL_CMD) -c "INSERT INTO public.delivery_addresses (id, address, comment, index, id_user) VALUES (DEFAULT, 'Kirov', null, null, 1)"

insert-payment-statuses:
	@echo "Заполнение таблицы payment_statuses:"
	@$(PSQL_CMD) -c "INSERT INTO public.payment_statuses (id, name) VALUES (1, 'Ожидание оплаты')"

insert-order-statutes:
	@echo "Заполнение таблицы order_statuses:"
	@$(PSQL_CMD) -c "INSERT INTO public.order_statuses (id, name) VALUES (1, 'Ожидание подтверждения')"

# Описание таблицы users
describe-users:
	@echo "Структура таблицы users:"
	@$(PSQL_CMD) -c "\d users"


.PHONY: help connect select-users describe-users start-db stop-db
