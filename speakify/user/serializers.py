from rest_framework import serializers

from .models import CustomUser, Interests, UserInterests


class InterestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interests
        fields = ["name"]


class UserSerializer(serializers.ModelSerializer):
    interests = InterestsSerializer(many=True, write_only=True)
    interest_set = serializers.SerializerMethodField()

    def get_interest_set(self, obj):
        return obj.user_set.all().values_list("interest__name", flat=True)

    def create(self, validated_data):
        interests_data = validated_data.pop("interests")
        user = CustomUser.objects.create(**validated_data)
        for interest_data in interests_data:
            interest = Interests.objects.get_or_create(**interest_data)[0]
            UserInterests.objects.create(user=user, interest=interest)
        user.set_password(validated_data["password"])
        user.save()
        return user

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "gender",
            "country",
            "password",
            "interests",
            "interest_set",
            "is_online",
        ]
