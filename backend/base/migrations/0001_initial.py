# Generated by Django 4.1.5 on 2023-01-06 04:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                (
                    "createdAt",
                    models.DateTimeField(blank=True, default=django.utils.timezone.now),
                ),
                ("username", models.CharField(max_length=200, unique=True)),
                ("name", models.CharField(blank=True, max_length=200, null=True)),
                ("email", models.EmailField(max_length=300, unique=True)),
                ("phoneNo", models.CharField(max_length=20, unique=True)),
                (
                    "profileImage",
                    models.ImageField(
                        blank=True,
                        default="default-profile.png",
                        null=True,
                        upload_to="",
                    ),
                ),
                (
                    "owner",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                (
                    "createdAt",
                    models.DateTimeField(blank=True, default=django.utils.timezone.now),
                ),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("clothing", "clothing"),
                            ("food", "food"),
                            ("entertainment", "entertainment"),
                            ("none", "none"),
                        ],
                        default="none",
                        max_length=200,
                    ),
                ),
                (
                    "shortDescription",
                    models.CharField(blank=True, max_length=300, null=True),
                ),
                ("participants", models.JSONField(blank=True, default=list, null=True)),
                (
                    "totalAmount",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                (
                    "splitType",
                    models.CharField(
                        choices=[
                            ("equally", "equally"),
                            ("treat", "treat"),
                            ("custom", "custom"),
                            ("none", "none"),
                        ],
                        default="none",
                        max_length=200,
                    ),
                ),
                ("isSplit", models.BooleanField(blank=True, default=False, null=True)),
                (
                    "paidBy",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="base.profile",
                    ),
                ),
            ],
        ),
    ]
