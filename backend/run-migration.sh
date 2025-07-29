#!/bin/bash

echo "Running database migration for portfolio fields..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the migration
echo "Executing migration..."
npm run migration:run

echo "Migration completed!"
echo "You can now restart your backend server to use the new portfolio features."