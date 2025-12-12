

# FastApi(Async) Clean Architecture Template

What's included in the template?

- Domain layer with sample entities.
- Application layer with abstractions for:
  - Example use cases
  - Cross-cutting concerns (logging, validation)
- Infrastructure layer with:
  - Authentication
  - SQLAlchemy, PostgreSQL or SQLite (you can change in db/core.py)
  - Rate limiting on registration
- Testing projects
  - Pytest unit tests
  - Pytest integration tests (e2e tests)


# Install virtual environment.
- `python -m venv venv`
- `source venv/bin/activate`

# Install all dependencies.
- Run `pip install -r requirements-dev.txt`

# How to run locally.
- Set a .env file based on env_sample
- run `uvicorn src.main:app --reload`

# How to create a migration file.
- Run `alembic revision -m "create some table"`

# How to apply migration changes: 
- Run `alembic upgrade head`

# How to run tests.
- Run `pytest` to run all tests

