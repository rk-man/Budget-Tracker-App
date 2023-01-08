from django.db import models
import uuid
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_save, pre_delete
from django.dispatch import receiver


class Profile(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)
    createdAt = models.DateTimeField(default=timezone.now, blank=True)
    owner = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=200, unique=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(
        max_length=300, unique=True)
    phoneNo = models.CharField(
        max_length=20, unique=True, null=True, blank=True)
    profileImage = models.ImageField(
        default="default-profile.png", null=True, blank=True)

    def __str__(self):
        return self.username


class Transaction(models.Model):
    CATEGORY_CHOICES = (
        ('clothing', "clothing"),
        ('food', 'food'),
        ('entertainment', 'entertainment'),
        ('travel', 'travel'),
        ('none', 'none'),
    )
    SPLIT_CHOICES = (
        ('split equally', "split equally"),
        ('treat', 'treat'),
        ('custom split', 'custom split'),
        ('one-time', 'one-time'),
        ('none', 'none'),
    )

    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)
    createdAt = models.DateTimeField(default=timezone.now, blank=True)
    owner = models.ForeignKey(
        Profile, on_delete=models.CASCADE, null=True, blank=True)
    category = models.CharField(
        default="none", choices=CATEGORY_CHOICES, max_length=200)
    shortDescription = models.CharField(null=True, blank=True, max_length=300)
    totalAmount = models.DecimalField(
        null=True, blank=True, max_digits=10, decimal_places=2)
    transactionType = models.CharField(
        default="none", choices=SPLIT_CHOICES, max_length=200)
    isSplit = models.BooleanField(default=False, null=True, blank=True)
    paidBy = models.ForeignKey(
        Profile, null=True, blank=True, on_delete=models.SET_NULL, related_name="paid_by")

    def __str__(self):
        return self.shortDescription


class Friend(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)
    createdAt = models.DateTimeField(default=timezone.now, blank=True)
    sender = models.ForeignKey(
        Profile, null=True, blank=True, on_delete=models.CASCADE, related_name="sender")
    friend = models.ForeignKey(
        Profile, null=True, blank=True, on_delete=models.CASCADE, related_name="friend")
    status = models.BooleanField(default=False, null=True, blank=True)

    class Meta:
        unique_together = ('sender', 'friend')

    def __str__(self):
        return self.sender.username


class Participant(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)
    createdAt = models.DateTimeField(default=timezone.now, blank=True)
    owner = models.ForeignKey(
        Profile, null=True, blank=True, on_delete=models.CASCADE, related_name="particpant_owner")
    transaction = models.ForeignKey(
        Transaction, null=True, blank=True, on_delete=models.CASCADE, related_name="participant_transaction")
    amountOwes = models.DecimalField(
        null=True, blank=True, max_digits=10, decimal_places=2)
    isPaid = models.BooleanField(default=False, null=True, blank=True)

    class Meta:
        unique_together = ('owner', 'transaction')

    def __str__(self):
        return self.owner.username


@receiver(post_save, sender=User)
def createProfile(sender, instance, created, **kwargs):
    if (created):
        print(instance)
        print("user created")
        Profile.objects.create(
            username=instance.username,
            email=instance.email,
            owner=instance
        )
    else:
        pass


@receiver(post_save, sender=Profile)
def updateUser(sender, instance, created, **kwargs):

    if (not created):
        user = instance.owner

        first_name = ""
        last_name = ""
        if (instance.name):
            name = instance.name.split(" ")

            if (len(name) >= 2):
                first_name = name[0]
                last_name = name[1]
            else:
                first_name = name
                last_name = ""

        user.first_name = first_name
        user.last_name = last_name
        user.username = instance.username
        user.email = instance.email

        user.save()

    else:
        pass


@receiver(pre_save, sender=Transaction)
def setIsSplit(sender, instance, *args, **kwargs):
    if (instance.transactionType != "treat" and instance.transactionType != "one-time"):
        instance.isSplit = True

    participants = Participant.objects.filter(
        transaction=instance)

    if (participants.count() > 0):
        if (instance.transactionType == "treat"):
            for eachP in participants:
                if (eachP.owner.id == instance.paidBy.id):
                    eachP.isPaid = True
                else:
                    eachP.isPaid = False
                eachP.amountOwes = 0
                eachP.isPaid = True
                eachP.save()
        elif (instance.transactionType == "split equally"):
            amountOwes = int(instance.totalAmount) / participants.count()
            for eachP in participants:
                if (eachP.owner.id == instance.paidBy.id):
                    eachP.isPaid = True
                else:
                    eachP.isPaid = False
                eachP.amountOwes = amountOwes
                eachP.save()

        elif (instance.transactionType == "custom split"):

            amountOwes = int(instance.totalAmount) / participants.count()
            for eachP in participants:
                if (eachP.owner.id == instance.paidBy.id):
                    eachP.isPaid = True
                else:
                    eachP.isPaid = False

                eachP.amountOwes = amountOwes
                eachP.save()


@receiver(pre_delete, sender=Participant)
def changeAmountStatus(sender, instance, *args, **kwargs):
    transaction = Transaction.objects.get(id=instance.transaction.id)
    if (transaction.transactionType == "split equally"):
        participants = Participant.objects.filter(transaction=transaction)
        splitAmount = transaction.totalAmount / (participants.count() - 1)
        for p in participants:
            if (p.id != instance.id):
                p.amountOwes = splitAmount
                p.save()
