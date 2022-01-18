FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY ./app /app

RUN pip install -r requirements.txt

ENV PYTHONPATH=/
ENV PORT=8000

