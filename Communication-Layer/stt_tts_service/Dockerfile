
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8002
# Use a timeout to allow models to download on first run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--timeout-keep-alive", "60"]
