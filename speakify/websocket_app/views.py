from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.shortcuts import HttpResponse

from speakify.user.models import CustomUser as User
from speakify.user.models import UserInterests


def connect_users(request):
    user = request.user
    channel_layer = get_channel_layer()

    user_interests = UserInterests.objects.filter(user=user).values_list(
        "interest_id", flat=True
    )
    matching_users = User.objects.filter(user_set__interest_id__in=user_interests)

    if not matching_users:
        online_users = User.objects.exclude(id=user.id).filter(is_online=True)
        if online_users:
            partner = online_users.first()
        else:
            return HttpResponse(
                "No matching users or online users found.", status_code=400
            )
    else:
        partner = matching_users.first()

    # Create a channel group for the two users
    group_name = f"user_{user.id}_partner_{partner.id}"
    async_to_sync(channel_layer.group_add)(group_name, request.channel_name)

    user_details = {
        "name": user.username,
        "gender": user.gender,
        "country": user.country,
    }
    partner_details = {
        "name": partner.username,
        "gender": partner.gender,
        "country": partner.country,
    }
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "show_details",
            "user_details": user_details,
            "partner_details": partner_details,
        },
    )

    return HttpResponse("Connected successfully.")
