# Generated by Django 4.1.4 on 2024-11-18 09:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_candidat_domain'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='note',
            field=models.TextField(blank=True, max_length=1500, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='start_date',
            field=models.DateField(null=True),
        ),
        migrations.CreateModel(
            name='TargetClient',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nom_client', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('adresse', models.TextField(blank=True, null=True)),
                ('ville', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('code_postale', models.IntegerField()),
                ('numero_fiscale', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('telephone', models.IntegerField()),
                ('mobile', models.IntegerField()),
                ('courriel', models.CharField(blank=True, max_length=254, null=True)),
                ('site_web', models.CharField(blank=True, max_length=254, null=True)),
                ('langue', models.CharField(blank=True, max_length=254, null=True)),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.client')),
            ],
        ),
        migrations.AddField(
            model_name='job',
            name='target_client',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.targetclient'),
        ),
    ]
