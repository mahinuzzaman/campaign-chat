build:
	docker-compose build

start-campaign-chat:
	docker-compose up -d

stop-campaign-chat:
	docker-compose down

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


frontend-quality: frontend-format-check frontend-lint frontend-type-check
	@echo "✅ Frontend code quality checks passed"

frontend-fix: frontend-format frontend-lint-fix
	@echo "✅ Frontend code auto-fixed"
