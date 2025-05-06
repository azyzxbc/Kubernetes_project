import calendar
import secrets
import string
from fpdf import FPDF
import os

import requests
import owncloud
import numpy as np
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from get_talent.settings import MEDIA_ROOT
import pdftotext
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
from paddleocr import PaddleOCR
from django.core.files.storage import FileSystemStorage
import doc2pdf
from django.conf import settings
# Load a specific .env file
dotenv_path = '.env.api'
load_dotenv(dotenv_path)


APIFY_TOKEN=os.environ.get("APIFY_TOKEN")
METHOD = os.environ.get('MATCHING_METHOD')


OWNCLOUD_PORT = os.getenv("OWNCLOUD_PORT", ) 
OWNCLOUD_USERNAME = os.getenv("OWNCLOUD_USERNAME", )
OWNCLOUD_PASSWORD = os.getenv("OWNCLOUD_PASSWORD", )
OWNCLOUD_URL = os.getenv("OWNCLOUD_URL", )

url = OWNCLOUD_URL
client = owncloud.Client(url)
username = OWNCLOUD_USERNAME
password = OWNCLOUD_PASSWORD
client.login(username, password)
ocr = PaddleOCR(use_angle_cls=True, lang='en')


def get_auth0_management_token():
    """Obtenir un token d'accès pour l'API Auth0 Management."""
    url = f"https://{settings.AUTH0_DOMAIN}/oauth/token"
    payload = {
        "client_id": settings.AUTH0_CLIENT_ID,
        "client_secret": settings.AUTH0_CLIENT_SECRET,
        "audience": f"https://{settings.AUTH0_DOMAIN}/api/v2/",
        "grant_type": "client_credentials",
        "scope": "read:roles"
    }
    response = requests.post(url, json=payload)
    return response.json().get("access_token")
def get_id_client(user_id):
    """Get client id"""
    token = get_auth0_management_token()
    print("user_id : ",user_id)
    url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{user_id}"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    print("response : ",response.json())
    response.raise_for_status()
    
    user_data = response.json()
    client_id=user_data.get("user_metadata", {})["id_client"]
    return client_id
def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password

    

def upload_job_to_owncloud(name,filepath,client_name):
    owncloud_path = f'{client_name}/Jobs'
    print("owncloud_path : ",owncloud_path)
    try:
        client.list(owncloud_path)
    except:
        client.mkdir(owncloud_path)

    client.put_file(f"{owncloud_path}/{name}",filepath)
    link_info = client.share_file_with_link(f"{owncloud_path}/{name}")
    link = link_info.get_link()
    return link

#=========================== CV MATCHER UTILS =========================



def extract(file):

    if not os.path.exists("/code/get-talent/media"):
        os.makedirs("/code/get-talent/media/job")

    with file.open(mode='rb') as f:
        pdf = pdftotext.PDF(f,physical=True)
    with(open("/code/get-talent/media/job/"+file.name+".txt","w",encoding='utf-8')) as f:
        for page in pdf:
            f.write(page) 
    with open("/code/get-talent/media/job/"+file.name+".txt", 'r') as fichier:
        text = fichier.read()
    os.remove("/code/get-talent/media/job/"+file.name+".txt")
    return text

      
def download_job(id,client_name):
      client.get_file(f"/{client_name}/Jobs/{id}.pdf", os.path.join(os.path.join(MEDIA_ROOT,"job"),str(id)+".pdf"))
        


def convert_txt_to_pdf(txt_file, pdf_file):
    # Ouverture du fichier texte en mode lecture
    with open(txt_file, "r", encoding="utf-8") as file:
        content = file.read()
    content = content.encode("latin1", "ignore").decode("latin1")
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, content)
    # Sauvegarde du fichier PDF
    pdf.output(pdf_file)


def convert_file(file,job_id):
    file_name=file.name
    extension=file_name.split(".")[-1]
    media_dir=MEDIA_ROOT
    storage = FileSystemStorage(location=os.path.join(media_dir,"job"))
    if(extension=="pdf"):
        saved_file = storage.save(f"{job_id}.pdf", file)
        file_path = os.path.join(os.path.join(media_dir,"job"), saved_file)
    
    elif extension == "txt":
        try:
            saved_file = storage.save(file_name, file)
            txt_file_path = os.path.join(os.path.join(media_dir,"job"), saved_file)
            file_path = os.path.join(os.path.join(media_dir,"job"), f"{job_id}.pdf")
            convert_txt_to_pdf(txt_file_path, file_path)
            os.remove(txt_file_path)
        except:
            return False,{"message":"the txt file cannot be converted to pdf"}

    elif extension == "docx":
        try:
            saved_file = storage.save(file_name, file)
            docx_file_path = os.path.join(os.path.join(media_dir,"job"), saved_file)
            file_path = os.path.join(os.path.join(media_dir,"job"), f"{job_id}.pdf")
            doc2pdf.convert(docx_file_path, file_path)
            os.remove(docx_file_path)
        except:
            return False,{"message":"the docx file cannot be converted to pdf"}
    return True, file_path

def create_pdf(text, file_name):
    # Create a PDF file
    c = canvas.Canvas(file_name, pagesize=letter)
    
    # Set font and size
    c.setFont("Helvetica", 12)
    
    # Split text into lines
    lines = text.split('\n')
    
    # Set initial y position
    y = 750
    
    # Write each line of text to the PDF
    for line in lines:
        c.drawString(100, y, line)
        y -= 20  # Move to the next line
    
    # Save the PDF
    c.save()




def convert_to_np(cv_embedding):
  
    if METHOD=="SENTENCE_TRANSFORMERS":
        cv_embedding=np.array(cv_embedding['embedding'][0])
        return cv_embedding
        
    elif METHOD=="COHEREMATCHER":
        cv_embedding=np.array(cv_embedding['embedding'])
        return cv_embedding

def embed_job(data):
    try:
        response = requests.post("http://51.77.211.147:8010/api/embedd/", json=data)
        response.raise_for_status()  # This raises an error if the status is not 2xx
        job_embedding = response.json()
        numpy_job_embedding=convert_to_np(job_embedding)
        return True,numpy_job_embedding
    except:
        print("error when embedding")
        return False,{"message":"error occurs when embedding"}


username = os.environ.get("email_ovh", ) 
password = os.environ.get("pwd_ovh", )
def send_email(recipient_email, subject, body):
    sender_email=username
    sender_password=password
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = recipient_email
    message['Subject'] = subject
    message.attach(MIMEText(body, 'plain'))
    
    # Connect to the SMTP server
    print("test")
    server = smtplib.SMTP('ssl0.ovh.net', 587)
    server.starttls()
    
    # Login to the email server
    server.login(sender_email, sender_password)
    print("connected")
    
    # Send the email
    server.sendmail(sender_email, recipient_email, message.as_string())
    
    # Quit the server
    server.quit()


def create_client_directories(client_name):
    root_directory = f"{client_name}/"
    resumes_directory = f"{client_name}/cv/"
    jobs_directory=f"{client_name}/Jobs/"
    try:
        # Check if the root directory exists
        client.file_info(root_directory)
    except :
            # Root directory does not exist, create the root and subdirectories
            try:
                # Create directories
                client.mkdir(root_directory)
                client.mkdir(resumes_directory)
                client.mkdir(jobs_directory)
            except owncloud.HTTPResponseError as e:
                raise e