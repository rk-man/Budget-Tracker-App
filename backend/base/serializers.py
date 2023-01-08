from rest_framework import serializers
from base.models import Profile, Transaction, Friend, Participant
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["username", "id", "email", "name", "isAdmin"]

    def get_name(self, obj):
        name = obj.first_name
        if (name == ""):
            name = obj.email
        return name

    def get_isAdmin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["username", "id", "email", "token", "isAdmin", "profile"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

    def get_profile(self, obj):
        profile = obj.profile
        sr = ProfileSerializer(profile, many=False)
        return sr.data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        exclude = ["owner"]


class ProfileSubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["username", "id", "profileImage"]


class TransactionSerializer(serializers.ModelSerializer):
    owner = ProfileSubSerializer(many=False)
    paidBy = ProfileSubSerializer(many=False)
    participants = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = "__all__"

    def get_participants(self, obj):
        participants = Participant.objects.filter(transaction=obj)
        psr = ParticipantSerializer(participants, many=True)
        return psr.data


class TransactionSubSerializer(serializers.ModelSerializer):
    paidBy = ProfileSubSerializer(many=False)

    class Meta:
        model = Transaction
        fields = ["paidBy", "id", "transactionType"]


class ParticipantSerializer(serializers.ModelSerializer):
    owner = ProfileSubSerializer(many=False)
    transaction = TransactionSubSerializer(many=False)

    class Meta:
        model = Participant
        fields = "__all__"


class FriendSerializer(serializers.ModelSerializer):
    sender = ProfileSubSerializer(many=False)
    friend = ProfileSubSerializer(many=False)

    class Meta:
        model = Friend
        fields = "__all__"
