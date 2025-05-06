# syntax=docker/dockerfile:1
FROM python:3.8-slim-bullseye
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# install dependencies
### update system
RUN apt-get -y update
### install libreoffice
RUN apt-get update && apt-get install -y libreoffice

### install pdftotext dependencies
RUN apt install -y build-essential libpoppler-cpp-dev pkg-config python3-dev vim
RUN apt-get update && apt-get install -y libgl1-mesa-glx
### install python requirements
WORKDIR /code/get-talent
COPY requirements_cvex.txt /code/get-talent/
RUN pip install pip --upgrade
RUN pip install -r requirements_cvex.txt
### Dependencies Spacy 
RUN apt-get install -y poppler-utils