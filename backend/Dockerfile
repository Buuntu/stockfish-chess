
FROM python:3.8

RUN mkdir /app
WORKDIR /app

RUN apt update && \
    apt install -y postgresql-client stockfish

COPY requirements/base.txt base_requirements.txt
COPY requirements/dev.txt dev_requirements.txt
RUN pip install -r base_requirements.txt
RUN pip install -r dev_requirements.txt

COPY . .