@echo off
echo Running database migration for portfolio fields...

REM Check if we're in the backend directory
if not exist "package.json" (
    echo Error: Please run this script from the backend directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Run the migration
echo Executing migration...
npm run migration:run

echo Migration completed!
echo You can now restart your backend server to use the new portfolio features.
pause