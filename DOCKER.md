# Docker Setup for SwadesAI

This project includes Docker Compose configuration for easy PostgreSQL setup.

## Quick Start

```bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL
docker compose down

# Stop and remove volumes (caution: deletes all data)
docker compose down -v
```

## PostgreSQL Details

- **Host**: localhost
- **Port**: 5432
- **Database**: swadesai_support
- **Username**: postgres
- **Password**: postgres

## Connection String

```
postgresql://postgres:postgres@localhost:5432/swadesai_support?schema=public
```

## Managing the Database

```bash
# View logs
docker compose logs postgres

# Access PostgreSQL CLI
docker compose exec postgres psql -U postgres -d swadesai_support

# Restart database
docker compose restart postgres
```

## Persistent Data

Database data is stored in a Docker volume named `swadesai-support_postgres_data`. This ensures your data persists across container restarts.
