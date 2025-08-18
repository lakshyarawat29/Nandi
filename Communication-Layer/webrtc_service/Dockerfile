FROM python:3.9-slim

WORKDIR /app

# Install system dependencies required by aiortc
RUN apt-get update && apt-get install -y libavdevice-dev libavfilter-dev libopus-dev libvpx-dev pkg-config

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
