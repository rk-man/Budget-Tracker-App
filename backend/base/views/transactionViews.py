from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from base.models import Transaction, Profile, Participant
from base.serializers import TransactionSerializer, ParticipantSerializer, TransactionSubSerializer
from base.decorators import protect
from rest_framework import status
from django.db.models import Q


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createTransaction(req):
    data = req.data
    profile = req.user.profile
    paidBy = data["paidBy"]

    try:
        paidBy = Profile.objects.get(id=data["paidBy"])
        print(paidBy)
    except Exception as ex:
        print(ex)

    try:
        transaction = Transaction.objects.create(
            owner=profile,
            category=data["category"],
            shortDescription=data["shortDescription"],
            totalAmount=data["totalAmount"],
            transactionType=data["transactionType"],
            paidBy=paidBy
        )

        totalAmount = transaction.totalAmount
        amountOwes = int(totalAmount) / len(data["participants"])

        for eachP in data["participants"]:
            owner = Profile.objects.get(id=eachP)
            if (transaction.paidBy.id == owner.id):
                print(f"Owner {transaction.paidBy.id == owner.id}")
                Participant.objects.create(
                    owner=owner,
                    transaction=transaction,
                    amountOwes=amountOwes,
                    isPaid=True
                )
            else:
                Participant.objects.create(
                    owner=owner,
                    transaction=transaction,
                    amountOwes=amountOwes,
                )

        sr = TransactionSerializer(transaction, many=False)

        return Response(sr.data)

    except Exception as ex:
        print("At create transaction : ", ex)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllTransactions(req, query):
    profile = req.user.profile
    try:
        print(query)
        transactions = []
        if (query != "" and query != "undefined"):
            transactions = Transaction.objects.filter(owner=profile).filter(
                Q(category=query) | Q(transactionType=query))
        else:
            transactions = Transaction.objects.filter(owner=profile)

        sr = TransactionSerializer(transactions, many=True)

        return Response(sr.data)

    except Exception as ex:
        print(ex)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSingleTransaction(req, pk):
    try:
        transaction = Transaction.objects.get(id=pk)
        sr = TransactionSerializer(transaction, many=False)
        return Response(sr.data)
    except Exception as ex:
        return Response({"detail": str(ex)}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@protect
def updateTransaction(req, pk):
    data = req.data
    paidBy = data["paidBy"]

    try:
        paidBy = Profile.objects.get(id=data["paidBy"])
        print(paidBy)
    except Exception as ex:
        print(ex)

    try:
        transaction = req.curTransaction
        transaction.category = data["category"]
        transaction.shortDescription = data["shortDescription"]
        transaction.totalAmount = data["totalAmount"]
        transaction.transactionType = data["transactionType"]
        transaction.paidBy = paidBy

        transaction.save()
        sr = TransactionSerializer(transaction, many=False)
        return Response(sr.data)

    except Exception as ex:
        print(ex)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@protect
def deleteTransaction(req, pk):
    try:
        transaction = req.curTransaction
        transaction.delete()
        return Response({
            "detail": "deleted successfully"
        })

    except Exception as ex:
        print(ex)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def updateParticipant(req, pk):
    try:
        participant = Participant.objects.get(id=pk)
        isPaid = req.data.get("isPaid", participant.isPaid)
        amountOwes = req.data.get("amountOwes", participant.amountOwes)
        participant.isPaid = isPaid
        participant.amountOwes = amountOwes
        participant.save()

        sr = ParticipantSerializer(participant, many=False)
        return Response(sr.data)
    except Exception as ex:
        return Response({"detail": str(ex)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def removeParticipant(req, pk):
    try:
        participant = Participant.objects.get(id=pk)
        transactionID = participant.transaction.id
        participant.delete()
        transaction = Transaction.objects.get(id=transactionID)
        sr = TransactionSerializer(transaction, many=False)
        return Response(sr.data)

    except Exception as ex:
        return Response({"detail": str(ex)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def addParticipant(req, pk):
    data = req.data
    try:
        transaction = Transaction.objects.get(id=pk)
        profile = Profile.objects.get(id=data["userID"])
        amountOwes = data["amountOwes"]
        isPaid = data["isPaid"]

        Participant.objects.create(
            owner=profile, transaction=transaction, amountOwes=amountOwes, isPaid=isPaid)

        transaction = Transaction.objects.get(id=pk)
        sr = TransactionSerializer(transaction, many=False)
        return Response(sr.data)

    except Exception as ex:
        return Response({"detail": str(ex)}, status=status.HTTP_400_BAD_REQUEST)
