# Generated by Django 4.1.4 on 2024-10-16 14:39

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidat',
            name='domain',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=254, null=True), default=list, size=None),
        ),
    ]
