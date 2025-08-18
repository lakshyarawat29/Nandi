
# database_service/Dockerfile
# Dockerfile to build the seeder service. It installs dependencies and runs the script.

FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY seed.py .

CMD ["python", "seed.py"]
