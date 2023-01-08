# Generated by Django 4.1.5 on 2023-01-07 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0013_remove_transaction_participants_participant"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="transaction",
            name="splitType",
        ),
        migrations.AddField(
            model_name="transaction",
            name="transactionType",
            field=models.CharField(
                choices=[
                    ("split equally", "split equally"),
                    ("treat", "treat"),
                    ("custom split", "custom split"),
                    ("one-to-one", "one-to-one"),
                    ("none", "none"),
                ],
                default="none",
                max_length=200,
            ),
        ),
    ]
