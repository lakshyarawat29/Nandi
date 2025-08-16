#!/bin/bash
# ================================================================
# NANDI RAG Model Setup and Start Script (Linux/Mac)
# ================================================================
# This script will:
# 1. Create a Python virtual environment
# 2. Install all required packages
# 3. Set up the vector database with documents
# 4. Start the FastAPI server
# ================================================================

echo "==============================================="
echo "NANDI RAG Model Setup and Start"
echo "==============================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed!"
    echo "Please install Python 3.8+ from https://python.org"
    read -p "Press Enter to exit"
    exit 1
fi

echo "✅ Python found!"
python3 --version

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo
    echo "==============================================="
    echo "Creating Virtual Environment..."
    echo "==============================================="
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment!"
        read -p "Press Enter to exit"
        exit 1
    fi
    echo "✅ Virtual environment created!"
else
    echo "✅ Virtual environment already exists!"
fi

# Activate virtual environment
echo
echo "==============================================="
echo "Activating Virtual Environment..."
echo "==============================================="
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment!"
    read -p "Press Enter to exit"
    exit 1
fi
echo "✅ Virtual environment activated!"

# Upgrade pip
echo
echo "==============================================="
echo "Upgrading pip..."
echo "==============================================="
python -m pip install --upgrade pip
if [ $? -ne 0 ]; then
    echo "WARNING: Failed to upgrade pip, continuing anyway..."
fi

# Install requirements
echo
echo "==============================================="
echo "Installing Requirements..."
echo "==============================================="
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install requirements!"
    read -p "Press Enter to exit"
    exit 1
fi
echo "✅ All requirements installed!"

# Check for Hugging Face API token
echo
echo "==============================================="
echo "Checking for Hugging Face API Token..."
echo "==============================================="
if [ -z "$HUGGINGFACEHUB_API_TOKEN" ]; then
    echo
    echo "⚠️  WARNING: HUGGINGFACEHUB_API_TOKEN not found!"
    echo "   Please set it using: export HUGGINGFACEHUB_API_TOKEN=your_token_here"
    echo "   Or add it to your ~/.bashrc or ~/.zshrc"
    echo "   Get your token from: https://huggingface.co/settings/tokens"
    echo
    read -p "Enter your Hugging Face API token (or press Enter to skip): " token
    if [ -n "$token" ]; then
        export HUGGINGFACEHUB_API_TOKEN=$token
        echo "export HUGGINGFACEHUB_API_TOKEN=$token" >> ~/.bashrc
        echo "✅ Token added to ~/.bashrc!"
    else
        echo "WARNING: No token provided. The API might not work without it."
    fi
else
    echo "✅ Hugging Face API token found!"
fi

# Set up vector database if it doesn't exist
echo
echo "==============================================="
echo "Setting up Vector Database..."
echo "==============================================="
if [ ! -d "vectorstore/db_faiss" ]; then
    echo "Creating vector database from documents..."
    python rag_handler.py
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create vector database!"
        echo "Make sure you have PDF documents in the data/ folder"
        read -p "Press Enter to exit"
        exit 1
    fi
    echo "✅ Vector database created!"
else
    echo "✅ Vector database already exists!"
fi

# Start the API server
echo
echo "==============================================="
echo "Starting API Server..."
echo "==============================================="
echo
echo "🚀 Starting NANDI RAG API Server..."
echo "📡 Server will be available at: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo "🛑 Press Ctrl+C to stop the server"
echo
echo "==============================================="

uvicorn api:app --host 0.0.0.0 --port 8000 --reload
