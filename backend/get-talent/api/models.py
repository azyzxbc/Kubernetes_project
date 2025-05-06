"""model file"""

from django.db import models
from django.db.models import Q
from django.core import serializers
import json
from django.contrib.postgres.fields import ArrayField
#from django.contrib.auth.models import User
# Create your models here.
#########################
from pgvector.django import VectorField
from datetime import datetime, timezone
from django.contrib.auth.models import AbstractUser, BaseUserManager
from .utils import create_client_directories


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class Skills(models.Model):
    id_skills = models.AutoField(primary_key=True)
    nom_skills = models.CharField(unique=True, max_length=255, blank=True, null=True)
    type_skills = models.CharField(max_length=255, blank=True, null=True)

class Certificat(models.Model):
    id_certificat = models.AutoField(primary_key=True)
    nom_certificat = models.CharField(max_length=255, blank=True, null=True)
    domaine = models.CharField(max_length=255, blank=True, null=True)
    duree = models.CharField(max_length=255, blank=True, null=True)
    organisation = models.CharField(max_length=255, blank=True, null=True)
    class Meta:
        unique_together = ('nom_certificat', 'domaine','duree','organisation')

class Education(models.Model):
    id_education = models.AutoField(primary_key=True)
    nom_ecole = models.CharField(max_length=255, blank=True, null=True)
    nom_diplome = models.CharField(max_length=255, blank=True, null=True)
    type_diplome = models.CharField(max_length=255, blank=True, null=True)
    specialite = models.CharField(max_length=255, blank=True, null=True)
    class Meta:
        unique_together = ('nom_ecole', 'nom_diplome','type_diplome','specialite')

class Formation(models.Model):
    id_formation = models.AutoField(primary_key=True)
    nom_formation = models.CharField(max_length=255, blank=True, null=True)
    duree_formation = models.CharField(db_column='Duree_formation', max_length=255, blank=True, null=True)
    class Meta:
        unique_together = (('nom_formation', 'duree_formation'))
class Langue(models.Model):
    id_langue = models.AutoField(primary_key=True)
    nom_langue = models.CharField(unique=True, max_length=255, blank=True, null=True)

# class Client(models.Model):
#     id_client = models.AutoField(primary_key=True)
#     nom_client = models.CharField(unique=True, max_length=255, blank=True, null=True)
#     def __str__(self):
#         return self.nom_client
#     def save(self, *args, **kwargs):
#         # Call the original save method to ensure the object is saved first
#         super(Client, self).save(*args, **kwargs)
#         create_client_directories(self.nom_client)


class User(AbstractUser):
    email = models.EmailField(blank=True, null=True)
    id_user = models.CharField(max_length=30,unique=True)  # Username is optional
    client_id = models.CharField(max_length=255,blank=True, null=True)
    username = models.CharField(max_length=30, blank=True, null=True)
    fullname = models.CharField(max_length=30, blank=True, null=True)
    location = models.CharField(max_length=30, blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE,null=True, db_column='client')

    USERNAME_FIELD = 'id_user'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    def __str__(self):
        return self.id_user

#Domaine Table
class Domaine(models.Model):
    id_domaine = models.AutoField(primary_key=True)
    nom_domaine = models.CharField(unique=True, max_length=255, blank=True, null=True)
    client_id = models.CharField(max_length=255, blank=True, null=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)

class Candidat(models.Model):
    id_candidat = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=50, blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=254, blank=True, null=True)
    phone = models.CharField(max_length=254, blank=True, null=True)
    domain = ArrayField(models.CharField(max_length=254, blank=True, null=True), null=True,default=list)
    datenaissance = models.DateField(blank=True, null=True)#models.DateTimeField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    sexe = models.CharField(max_length=255, blank=True, null=True)
    pays_de_residence = models.CharField(max_length=255, blank=True, null=True)
    poste_actuelle = models.CharField(max_length=255, blank=True, null=True)
    nbrexp = models.FloatField(blank=True, null=True)
    skills = ArrayField(models.JSONField(blank=True, null=True), default=list)
    certificat = ArrayField(models.JSONField(blank=True, null=True), default=list)
    experience = ArrayField(models.JSONField(blank=True, null=True), default=list)
    formation = ArrayField(models.JSONField(blank=True, null=True), default=list)
    education = ArrayField(models.JSONField(blank=True, null=True), default=list)
    langues = ArrayField(models.CharField(max_length=255, blank=True),default=list)
    linkedin_url = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=30, blank=True, null=True)
    archived_id =models.IntegerField(blank=True, null=True)
    status=models.CharField(max_length=30, default='pending')
    embedding = VectorField(dimensions=384,null=True)
    embedding_cohere = VectorField(dimensions=4096,null=True)
    skills_jointure = models.ManyToManyField(Skills, through="CandidatHasSkills")
    formation_jointure = models.ManyToManyField(Formation, through="CandidatHasFormation")
    langues_jointure = models.ManyToManyField(Langue, through="CandidatHasLangue")
    certificat_jointure = models.ManyToManyField(Certificat, through="CandidatHasCertificat")
    domain_jointure = models.ManyToManyField(Domaine, through="CandidatHasDomaine")
    education_jointure = models.ManyToManyField(Education, through="CandidatHasEducation")
    CV_Link = models.CharField(max_length=255, blank=True, null=True)
    client_id = models.CharField(max_length=255, blank=True, null=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = (('id_candidat', 'client_id'))

class Archived_candidat(models.Model):
    id=models.AutoField(primary_key=True)
    first_id =models.IntegerField()
    nom = models.CharField(max_length=50, blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=254, blank=True, null=True)
    phone = models.CharField(max_length=254, blank=True, null=True)
    domain = ArrayField(models.CharField(max_length=254, blank=True, null=True), null=True,default=list)
    datenaissance = models.DateField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    sexe = models.CharField(max_length=255, blank=True, null=True)
    pays_de_residence = models.CharField(max_length=255, blank=True, null=True)
    poste_actuelle = models.CharField(max_length=255, blank=True, null=True)
    nbrexp = models.FloatField(blank=True, null=True)
    skills = ArrayField(models.JSONField(blank=True, null=True), default=list)
    certificat = ArrayField(models.JSONField(blank=True, null=True), default=list)
    experience = ArrayField(models.JSONField(blank=True, null=True), default=list)
    formation = ArrayField(models.JSONField(blank=True, null=True), default=list)
    education = ArrayField(models.JSONField(blank=True, null=True), default=list)
    langues = ArrayField(models.CharField(max_length=255, blank=True),default=list)
    linkedin_url = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=30, blank=True, null=True)
    embedding = VectorField(dimensions=384,null=True)
    embedding_cohere = VectorField(dimensions=4096,null=True)
    CV_Link = models.CharField(max_length=255, blank=True, null=True)
    client_id = models.CharField(max_length=255, blank=True, null=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    class Meta:
        unique_together = (('id', 'client_id'))



class Expprof(models.Model):
    id_exp = models.AutoField(primary_key=True)
    id_candidat = models.ForeignKey(Candidat, db_column='id_candidat',on_delete=models.CASCADE)
    date = models.CharField(max_length=255, blank=True, null=True)
    titre_prof = models.CharField(max_length=255, blank=True, null=True)
    nom_societe = models.CharField(max_length=255, blank=True, null=True)
    poste = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    technos = models.CharField(max_length=255, blank=True, null=True)
    class Meta:
        unique_together = ('date', 'titre_prof','nom_societe', 'poste','description', 'technos')

class CandidatHasCertificat(models.Model):
    id_candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, db_column='id_candidat')
    id_certificat = models.ForeignKey(Certificat, on_delete=models.CASCADE, db_column='id_certificat')
    date_obtention = models.CharField(max_length=255,blank=True, null=True)
    date_expiration = models.CharField(max_length=255,blank=True, null=True)

    class Meta:
        unique_together = (('id_candidat', 'id_certificat'))

class CandidatHasDomaine(models.Model):
    id_candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, db_column='id_candidat')
    id_domaine = models.ForeignKey(Domaine, on_delete=models.CASCADE, db_column='id_domaine')

    class Meta:
        unique_together = (('id_candidat', 'id_domaine'))

class CandidatHasEducation(models.Model):
    id_candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, db_column='id_candidat')
    id_education = models.ForeignKey(Education, on_delete=models.CASCADE, db_column='id_education')
    date_obtention = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = (('id_candidat', 'id_education'))

class CandidatHasFormation(models.Model):
    id_candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, db_column='id_candidat')
    id_formation = models.ForeignKey(Formation, on_delete=models.CASCADE, db_column='id_formation')

    class Meta:
        unique_together = (('id_candidat', 'id_formation'))

class CandidatHasLangue(models.Model):
    id_candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, db_column='id_candidat')
    id_langue = models.ForeignKey(Langue, on_delete=models.CASCADE, db_column='id_langue')

    class Meta:
        unique_together = (('id_candidat', 'id_langue'))

class CandidatHasSkills(models.Model):
    id_candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, db_column='id_candidat')
    id_skills = models.ForeignKey(Skills, on_delete=models.CASCADE, db_column='id_skills')

    class Meta:
        unique_together = (('id_candidat', 'id_skills'))
class TargetClient(models.Model):
    id = models.AutoField(primary_key=True)
    nom_client = models.CharField(unique=True, max_length=255, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    ville = models.CharField(max_length=255, blank=True, null=True)
    code_postale= models.IntegerField()
    numero_fiscale = models.CharField(unique=True, max_length=255, blank=True, null=True)
    telephone= models.IntegerField()
    mobile= models.IntegerField()
    courriel= models.CharField(max_length=254, blank=True, null=True)
    site_web=models.CharField(max_length=254, blank=True, null=True)
    langue=models.CharField(max_length=254, blank=True, null=True)
    client_id = models.CharField(max_length=255, blank=True, null=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    def __str__(self):
        return self.nom_client
class Job(models.Model):
    id = models.AutoField(primary_key=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    description=models.TextField(blank=True, null=True)
    location = models.CharField(max_length=55, blank=True, null=True)
    salaire_minimum = models.FloatField(null=True)
    salaire_maximum = models.FloatField(null=True)
    note=models.TextField(max_length=1500, blank=True, null=True)
    destination = models.CharField(max_length=55, blank=True, null=True)
    insertion_date = models.DateField(auto_now=True)
    start_date = models.DateField(null=True)
    job_Link = models.CharField(max_length=255, blank=True, null=True)
    job_status=models.CharField(max_length=30, default='open')
    client_id = models.CharField(max_length=255, blank=True, null=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    target_client = models.ForeignKey(TargetClient, on_delete=models.CASCADE, null=True)
    embedding = VectorField(dimensions=384,null=True)
    class Meta:
        unique_together = ('file_name', 'destination','client_id')


class Matching(models.Model):
    id = models.AutoField(primary_key=True)
    id_candidat =models.ForeignKey(Candidat, on_delete=models.CASCADE)
    id_job =models.ForeignKey(Job, on_delete=models.CASCADE)
    similarity_score = models.FloatField()
    favori=models.BooleanField(default=False)
    rh=models.CharField(max_length=55, default='not started')
    technique=models.CharField(max_length=55, default='not started')
    test_technique=models.CharField(max_length=55, default='not started')
    dg=models.CharField(max_length=55, default='not started')
    note_dg=models.TextField(max_length=1500, blank=True, null=True)
    note_technique=models.TextField(max_length=1500, blank=True, null=True)
    note_test_technique=models.TextField(max_length=1500, blank=True, null=True)
    note_rh=models.TextField(max_length=1500, blank=True, null=True)
    client_id = models.CharField(max_length=255, blank=True, null=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_candidat', 'id_job','client_id'], name='unique_matching')
        ]


class LinkedinProfile(models.Model):
    id_profile = models.AutoField(primary_key=True)
    client_id = models.CharField(max_length=255, blank=True, null=True)
    #client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    keywords = models.CharField(max_length=200, blank=True, null=True)
    url = models.CharField(max_length=5000, blank=True, null=True)

    class Meta:
        unique_together = (('id_profile', 'client_id'))

    
def submit(data):
    instance = Candidat.objects.filter(pk=data.get("id_candidat")).first()
     
    for sk in data["skills"]:
        skill_data = {
            'nom_skills': sk['skill_name'],
            'type_skills': sk['skill_type']
        }
        skill = Skills(**skill_data)

        try:
            skill.save()
        except:
            skill = Skills.objects.get(nom_skills=sk['skill_name']).id_skills
        instance.skills_jointure.add(skill)
    if "formation" in data:
        for obj in data["formation"]:
            formation_data={
                'nom_formation': obj['name'],
                'duree_formation': obj['duration']
            }
            if formation_data['nom_formation'] != '' or formation_data['duree_formation'] != '':
                fr = Formation(**formation_data)
                try:
                    fr.save()
                except:
                    fr = Formation.objects.get(**obj).id
                instance.formation_jointure.add(fr)
    if "domain" in data:
        if data["domain"]:
            for obj in data["domain"]:
                dom = Domaine(nom_domaine=obj)
                try:
                    dom.save()
                except:
                    dom = Domaine.objects.get(nom_domaine=obj).id_domaine
                instance.domain_jointure.add(dom)

    for obj in data["langues"]:
        lg = Langue(nom_langue = obj)
        try:
            lg.save() 
        except:
            lg = Langue.objects.get(nom_langue = obj).id_langue
        instance.langues_jointure.add(lg)
    if "certificat" in data:
        for obj in data["certificat"]:
            cr = Certificat(nom_certificat=obj['NomCertificat'],domaine=obj['Domaine'],organisation=obj['Organisation'])
            try:
                cr.save()
            except:
                cr = Certificat.objects.get(nom_certificat=obj['NomCertificat']).id_certificat
            instance.certificat_jointure.add(cr, through_defaults= {"date_obtention":obj['DateObtention'],"date_expiration":obj['dateExperation']})
    for obj in data["education"]:
        ed = Education(nom_ecole=obj['nomEcole'],nom_diplome=obj['nomDiplome'],type_diplome=obj['typeDiplome'],specialite=obj['specialite'])
        try:
            ed.save()
        except:
            ed = Education.objects.get(nom_ecole=obj['nomEcole'],nom_diplome=obj['nomDiplome'],type_diplome=obj['typeDiplome'],specialite=obj['specialite']).id_education
        instance.education_jointure.add(ed, through_defaults= {"date_obtention":obj['dateObtention']})
    for obj in data["experience"]:
        tmp_obj = {"nom_societe": obj.get("nom_societe", None),
                "description": obj.get("description", None),
                "poste": obj.get("poste",None),
                }
        exp = Expprof(**tmp_obj,id_candidat=instance)
        try:
            exp.save()
        except:
            pass
        
    instance.status = "completed"
    instance.save()    
    return data.get("id_candidat")
        
def save_data(data,client_id):    
    C1 = Candidat(nom=data["nom"],
                  email=data["email"],
                  phone=data["phone"],
                  datenaissance=data["datenaissance"],
                  age=data["age"],
                  sexe=data["sexe"],
                  pays_de_residence=data["pays_de_residence"],
                  poste_actuelle=data["poste_actuelle"],
                  nbrexp= data.get('nbrexp', None),
                  source = data.get('source', None),
                  linkedin_url = data.get("linkedin_url",None),
                  certificat = list(data["certificat"]),
                  experience = list(data["experience"]),
                  skills = list(data["skills"]),
                  CV_Link = None,
                  education = list(data["education"]),
                  file_name = (data["file_name"]),
                  langues = list(data["langues"]),
                  domain = None,
                  client_id = client_id
                  )
    C1.save()
    id=C1.id_candidat
    return id

def update_data(candidat, data, client_id):
    # Update the fields with the new data
    candidat.nom = data["nom"]
    candidat.email = data["email"]  # Assuming you might want to update email too
    candidat.phone = data["phone"]
    candidat.datenaissance = data["datenaissance"]
    candidat.age = data["age"]
    candidat.sexe = data["sexe"]
    candidat.pays_de_residence = data["pays_de_residence"]
    candidat.poste_actuelle = data["poste_actuelle"]
    candidat.nbrexp = data.get('nbrexp', None)
    candidat.source = data.get('source', None)
    candidat.linkedin_url = data.get("linkedin_url", None)
    candidat.certificat = list(data["certificat"])
    candidat.experience = list(data["experience"])
    candidat.date_insrtion=datetime.now(timezone.utc)
    candidat.skills = list(data["skills"])
    candidat.education = list(data["education"])
    candidat.langues = list(data["langues"])
    candidat.client_id = client_id
    candidat.embediing=None
    candidat.embedding_cohere=None
    
    # Save the updated Candidat object
    candidat.save()


def get_candidat():
    objs = serializers.serialize("json", Candidat.objects.all())
    return json.loads(objs)


def get_matching(des):
    try:
        matching_jobs = Job.objects.filter(destination=des)
        serializer = serializers.serialize("json", matching_jobs)
        serializer=json.loads(serializer)
        return serializer
    except:
        return "not found"

def get_jobs_for_candidate(id_candidat,user_id):
    jobs = Matching.objects.filter(id_candidat=id_candidat,client_id=user_id).order_by('-similarity_score').values('id','id_job', 'similarity_score', 
                                             'id_job__file_name', 'id_job__destination', 'id_job__insertion_date', 'id_job__job_Link')
    print("=========MATCHING JOB===========")
    print(jobs)
    print("=========MATCHING JOB===========")
    return jobs

def get_candidates_for_job(job_id,user_id):
    candidate = Matching.objects.filter(id_job=job_id).order_by('-similarity_score').values('id','id_candidat', 'similarity_score',
                                                                                            'id_candidat__file_name',
                                                                                            'id_candidat__CV_Link',
                                                                                            'id_candidat__nom',
                                                                                            'id_candidat__pays_de_residence',
                                                                                            'id_candidat__nbrexp',
                                                                                            'id_candidat__linkedin_url',
                                                                                            )
    return candidate

def get_domaines():
    objs = serializers.serialize("json", Domaine.objects.all())
    return json.loads(objs)

def is_candidat_exist(data,user_id):
    email_query = Q(email=data["email"], client_id=user_id)
    phone_query = Q(phone=data["phone"], client_id=user_id)
    candidat_query = Candidat.objects.filter(email_query | phone_query)
    if candidat_query.exists():
        return candidat_query.first().id_candidat
    #candidat_query[0]
    else:
        return False
    #None


def save_job(file_name,des,note,start_date,target_client_id,user_id):
    file_name=file_name.split('.')[-2]
    try:
        # Try to get the existing job with the given file_name
        job = Job.objects.get(file_name=file_name,destination=des,target_client_id=target_client_id,client_id=user_id,insertion_date=datetime.now(timezone.utc))
        return job.id,True
    except:
        # If the job does not exist, create a new one
        job = Job(file_name=file_name,destination=des,note=note,start_date=start_date,target_client_id=target_client_id,client_id=user_id)
        job.save()
        return job.id,False

def save_matching(data):
    job=Job.objects.get(id=data["id_job"],client_id=data["client_id"])
    candidat=Candidat.objects.get(id_candidat=data["id_candidat"],client_id=data["client_id"])
    matching=Matching(id_job=job,id_candidat=candidat,similarity_score=data["similarity_score"],client_id=data["client_id"])
    try:
        matching.save()
    except Exception as e:
        print(e)
