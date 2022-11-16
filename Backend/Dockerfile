FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SUPERUSER_USER=Nelium
ENV DJANGO_SUPERUSER_EMAIL=pablo.cardenal117@gmail.com
ENV DJANGO_SUPERUSER_PASSWORD=AirControl
COPY . .
WORKDIR /nelium_air_control
RUN pip3 install -r requirements.txt
CMD python3 manage.py makemigrations; python3 manage.py migrate; python3 manage.py createsuperuser --noinput --username $DJANGO_SUPERUSER_USER --email $DJANGO_SUPERUSER_EMAIL; python3 manage.py runserver 0.0.0.0:8000