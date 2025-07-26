#!/bin/bash

echo "🚀 JobBoard Setup Script"
echo "========================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if PostgreSQL is running (optional check)
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client found"
else
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed and running."
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend

# Install dependencies
npm install

# Copy environment file
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please update .env with your database and JWT configuration"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend

# Install dependencies
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    cp env.example .env.local
    echo "✅ Created .env.local file from template"
    echo "⚠️  Please update .env.local with your API configuration"
else
    echo "✅ .env.local file already exists"
fi

cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Update backend/.env with your database and JWT configuration"
echo "2. Update frontend/.env.local with your API URL"
echo "3. Run database migrations: cd backend && npx prisma migrate dev"
echo "4. Start the backend: cd backend && npm run start:dev"
echo "5. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Access URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001/api"
echo ""
echo "Happy coding! 🚀" 