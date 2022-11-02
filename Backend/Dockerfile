FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY . .
WORKDIR /nelium_air_control
RUN pip3 install -r requirements.txt
CMD python3 manage.py makemigrations; python3 manage.py migrate; python3 manage.py runserver 0.0.0.0:8000