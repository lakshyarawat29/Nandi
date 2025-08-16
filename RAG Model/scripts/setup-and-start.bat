@echo off
REM ================================================================
REM NANDI RAG Model Setup and Start Script (Windows)
REM ================================================================
REM This script will:
REM 1. Create a Python virtual environment
REM 2. Install all required packages
REM 3. Set up the vector database with documents
REM 4. Start the FastAPI server
REM ================================================================

title NANDI RAG Model - Setup and Start

echo.
echo ================================================
echo NANDI RAG Model Setup and Start
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python found!
python --version

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo.
    echo ================================================
    echo Creating Virtual Environment...
    echo ================================================
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo ✅ Virtual environment created!
) else (
    echo ✅ Virtual environment already exists!
)

REM Activate virtual environment
echo.
echo ================================================
    echo Activating Virtual Environment...
echo ================================================
call venv\Scripts\activate
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b 1
)
echo ✅ Virtual environment activated!

REM Upgrade pip
echo.
echo ================================================
echo Upgrading pip...
echo ================================================
python -m pip install --upgrade pip
if errorlevel 1 (
    echo WARNING: Failed to upgrade pip, continuing anyway...
)

REM Install requirements
echo.
echo ================================================
echo Installing Requirements...
echo ================================================
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install requirements!
    pause
    exit /b 1
)
echo ✅ All requirements installed!

REM Check for Hugging Face API token
echo.
echo ================================================
echo Checking for Hugging Face API Token...
echo ================================================
if not defined HUGGINGFACEHUB_API_TOKEN (
    echo.
    echo ⚠️  WARNING: HUGGINGFACEHUB_API_TOKEN not found!
    echo    Please set it using: set HUGGINGFACEHUB_API_TOKEN=your_token_here
    echo    Or set it permanently in Windows Environment Variables
    echo    Get your token from: https://huggingface.co/settings/tokens
    echo.
    set /p HUGGINGFACEHUB_API_TOKEN="Enter your Hugging Face API token (or press Enter to skip): "
    if "%HUGGINGFACEHUB_API_TOKEN%"=="" (
        echo WARNING: No token provided. The API might not work without it.
    ) else (
        setx HUGGINGFACEHUB_API_TOKEN "%HUGGINGFACEHUB_API_TOKEN%"
        echo ✅ Token saved to environment variables!
    )
) else (
    echo ✅ Hugging Face API token found!
)

REM Set up vector database if it doesn't exist
echo.
echo ================================================
echo Setting up Vector Database...
echo ================================================
if not exist "vectorstore\db_faiss" (
    echo Creating vector database from documents...
    python rag_handler.py
    if errorlevel 1 (
        echo ERROR: Failed to create vector database!
        echo Make sure you have PDF documents in the data/ folder
        pause
        exit /b 1
    )
    echo ✅ Vector database created!
) else (
    echo ✅ Vector database already exists!
)

REM Start the API server
echo.
echo ================================================
echo Starting API Server...
echo ================================================
echo.
echo 🚀 Starting NANDI RAG API Server...
echo 📡 Server will be available at: http://localhost:8000
echo 📖 API Documentation: http://localhost:8000/docs
echo 🛑 Press Ctrl+C to stop the server
echo.
echo ================================================

uvicorn api:app --host 0.0.0.0 --port 8000 --reload

pause
