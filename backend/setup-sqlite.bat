@echo off
echo Setting up SQLite database for Job Board...

REM Copy environment file
if not exist .env (
    copy env.example .env
    echo Created .env file from env.example
)

REM Update DATABASE_URL to use SQLite
powershell -Command "(Get-Content .env) -replace 'DATABASE_URL=.*', 'DATABASE_URL=\"sqlite://./database.sqlite\"' | Set-Content .env"
echo Updated DATABASE_URL to use SQLite

REM Install SQLite dependencies if needed
npm install sqlite3

REM Run migration
echo Running database migration...
npm run migration:run

echo Setup complete! You can now start the backend with: npm run start:dev
pause