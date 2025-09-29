# Docker commands
build:
	docker compose build

start-campaign-chat:
	docker compose up -d

stop-campaign-chat:
	docker compose down

# Frontend code quality
frontend-lint:
	cd frontend && npm run lint

frontend-lint-fix:
	cd frontend && npm run lint:fix

frontend-format:
	cd frontend && npm run format

frontend-format-check:
	cd frontend && npm run format:check

frontend-type-check:
	cd frontend && npm run type-check

# Backend code quality
backend-format:
	cd backend && python -m black .

backend-format-check:
	cd backend && python -m black --check .

backend-lint:
	cd backend && python -m flake8 .

backend-type-check:
	cd backend && python -m mypy .

backend-sort-imports:
	cd backend && python -m isort .

backend-sort-imports-check:
	cd backend && python -m isort --check-only .


frontend-quality: frontend-format-check frontend-lint frontend-type-check
	@echo "✅ Frontend code quality checks passed"

backend-quality: backend-format-check backend-sort-imports-check backend-lint
	@echo "✅ Backend code quality checks passed"

quality-check: frontend-quality backend-quality
	@echo "✅ All code quality checks passed"


frontend-fix: frontend-format frontend-lint-fix
	@echo "✅ Frontend code auto-fixed"

backend-fix: backend-format backend-sort-imports
	@echo "✅ Backend code auto-fixed"

fix-all: frontend-fix backend-fix
	@echo "✅ All code auto-fixed"

# Help
help:
	@echo "Available commands:"
	@echo ""
	@echo "Code Quality:"
	@echo "  make quality-check     - Run all code quality checks"
	@echo "  make fix-all          - Auto-fix all formatting and imports"
	@echo "  make frontend-quality - Run frontend quality checks"
	@echo "  make backend-quality  - Run backend quality checks"
	@echo "  make frontend-fix     - Auto-fix frontend code"
	@echo "  make backend-fix      - Auto-fix backend code"
	@echo ""
	@echo "Docker:"
	@echo "  make build            - Build all Docker containers"
	@echo "  make start-campaign-chat - Start the application"
	@echo "  make stop-campaign-chat  - Stop the application"
