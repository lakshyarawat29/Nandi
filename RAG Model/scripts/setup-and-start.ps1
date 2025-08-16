# ================================================================
# NANDI RAG Model Setup and Start Script (PowerShell)
# ================================================================
# This script will:
# 1. Create a Python virtual environment
# 2. Install all required packages
# 3. Set up the vector database with documents
# 4. Start the FastAPI server
# ================================================================

Write-Host @"
===============================================
NANDI RAG Model Setup and Start
===============================================
"@ -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found! $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host @"
===============================================
Creating Virtual Environment...
===============================================
"@ -ForegroundColor Cyan
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create virtual environment!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists!" -ForegroundColor Green
}

# Activate virtual environment
Write-Host @"
===============================================
Activating Virtual Environment...
===============================================
"@ -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to activate virtual environment!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Virtual environment activated!" -ForegroundColor Green

# Upgrade pip
Write-Host @"
===============================================
Upgrading pip...
===============================================
"@ -ForegroundColor Cyan
python -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Failed to upgrade pip, continuing anyway..." -ForegroundColor Yellow
}

# Install requirements
Write-Host @"
===============================================
Installing Requirements...
===============================================
"@ -ForegroundColor Cyan
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install requirements!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ All requirements installed!" -ForegroundColor Green

# Check for Hugging Face API token
Write-Host @"
===============================================
Checking for Hugging Face API Token...
===============================================
"@ -ForegroundColor Cyan

if (-not $env:HUGGINGFACEHUB_API_TOKEN) {
    Write-Host @"
⚠️  WARNING: HUGGINGFACEHUB_API_TOKEN not found!
   Please set it using: `$env:HUGGINGFACEHUB_API_TOKEN = "your_token_here"
   Or set it permanently in Windows Environment Variables
   Get your token from: https://huggingface.co/settings/tokens
"@ -ForegroundColor Yellow
    
    $token = Read-Host "Enter your Hugging Face API token (or press Enter to skip)"
    if ($token) {
        [Environment]::SetEnvironmentVariable("HUGGINGFACEHUB_API_TOKEN", $token, "User")
        $env:HUGGINGFACEHUB_API_TOKEN = $token
        Write-Host "✅ Token saved to environment variables!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: No token provided. The API might not work without it." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Hugging Face API token found!" -ForegroundColor Green
}

# Set up vector database if it doesn't exist
Write-Host @"
===============================================
Setting up Vector Database...
===============================================
"@ -ForegroundColor Cyan

if (-not (Test-Path "vectorstore\db_faiss")) {
    Write-Host "Creating vector database from documents..." -ForegroundColor Yellow
    python rag_handler.py
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create vector database!" -ForegroundColor Red
        Write-Host "Make sure you have PDF documents in the data/ folder" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Vector database created!" -ForegroundColor Green
} else {
    Write-Host "✅ Vector database already exists!" -ForegroundColor Green
}

# Start the API server
Write-Host @"
===============================================
Starting API Server...
===============================================
"@ -ForegroundColor Cyan

Write-Host @"
🚀 Starting NANDI RAG API Server...
📡 Server will be available at: http://localhost:8000
📖 API Documentation: http://localhost:8000/docs
🛑 Press Ctrl+C to stop the server
"@ -ForegroundColor Green

Write-Host "===============================================" -ForegroundColor Cyan

uvicorn api:app --host 0.0.0.0 --port 8000 --reload
