# Generated by Django 4.1.4 on 2024-12-18 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_archived_candidat_archived_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='candidat',
            name='archived',
        ),
        migrations.AddField(
            model_name='candidat',
            name='archived_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
