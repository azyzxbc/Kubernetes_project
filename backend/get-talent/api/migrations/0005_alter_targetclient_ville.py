# Generated by Django 4.1.4 on 2024-11-20 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_job_description_job_note_job_start_date_targetclient_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='targetclient',
            name='ville',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
