# Generated by Django 4.1.5 on 2023-01-06 06:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0007_remove_transaction_participants"),
    ]

    operations = [
        migrations.AlterField(
            model_name="participant",
            name="participant",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="base.profile"
            ),
        ),
        migrations.AlterField(
            model_name="participant",
            name="transaction",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="base.transaction"
            ),
        ),
        migrations.AlterField(
            model_name="transaction",
            name="owner",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="base.profile",
            ),
        ),
        migrations.AlterField(
            model_name="transaction",
            name="paidBy",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="paid_by",
                to="base.profile",
            ),
        ),
    ]
