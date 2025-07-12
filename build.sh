#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Build server
echo "Building server..."
cd server
npm install
cd ..

# Build client
echo "Building client..."
cd client
npm install
npm run build
cd ..

echo "Build process completed successfully!"
