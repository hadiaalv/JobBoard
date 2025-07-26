@echo off
echo 🚀 JobBoard Setup Script
echo ========================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

echo.
echo 📦 Installing Backend Dependencies...
cd backend

REM Install dependencies
call npm install

REM Copy environment file
if not exist .env (
    copy env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please update .env with your database and JWT configuration
) else (
    echo ✅ .env file already exists
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate

echo.
echo 📦 Installing Frontend Dependencies...
cd ..\frontend

REM Install dependencies
call npm install

REM Copy environment file
if not exist .env.local (
    copy env.example .env.local
    echo ✅ Created .env.local file from template
    echo ⚠️  Please update .env.local with your API configuration
) else (
    echo ✅ .env.local file already exists
)

cd ..

echo.
echo 🎉 Setup Complete!
echo.
echo Next Steps:
echo 1. Update backend\.env with your database and JWT configuration
echo 2. Update frontend\.env.local with your API URL
echo 3. Run database migrations: cd backend ^&^& npx prisma migrate dev
echo 4. Start the backend: cd backend ^&^& npm run start:dev
echo 5. Start the frontend: cd frontend ^&^& npm run dev
echo.
echo Access URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001/api
echo.
echo Happy coding! 🚀
pause 