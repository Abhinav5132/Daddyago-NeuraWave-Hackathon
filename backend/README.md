No, migrations **do not** run automatically. You must manually apply them.

---

## README Section: Database Migrations
MAKE SURE YOU ARE IN THE BACKEND FOLDER

### Database Setup & Migrations

This project uses Flask-Migrate for database schema management.

**Prerequisites:**
```bash
pip install -r requirements.txt  # includes Flask-Migrate
```

**First-time setup (after cloning):**
```bash
# Create instance folder if it doesn't exist
mkdir instance

# Apply existing migrations to create database
flask db upgrade
```

**When you change models:**
```bash
# 1. Generate migration script
flask db migrate -m "Description of changes"

# 2. Review the generated script in migrations/versions/

# 3. Apply the migration
flask db upgrade
```

**Common commands:**
- `flask db upgrade` - Apply pending migrations
- `flask db downgrade` - Roll back last migration
- `flask db history` - View migration history

**Production deployment:**
```bash
# Always backup first!
flask db upgrade
```

**Important:** The `instance/` folder and `*.db` files are **not** tracked in git (see `.gitignore`).