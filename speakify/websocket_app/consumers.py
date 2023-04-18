import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from user.models import CustomUser as User


# from websocket_app.middlewares import TokenAuthMiddlewareStack


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = int(self.scope["query_string"].decode().split("=")[1])
        self.user = await self.get_user()
        self.user_interests = await self.get_user_interests()

        self.partner = None
        # await self.channel_layer.group_add("chat_group", self.channel_name)
        await self.accept()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']
        message = text_data_json["message"]
        if message_type == 'send_user_details':
            self.partner = await self.get_matching_user()
            await self.channel_layer.group_add(f"chat_{self.user.id}_{self.partner.id}", self.channel_name)
            await self.send_partner_details()
        if message_type == "chat_message":
            await self.channel_layer.group_send(
                f"chat_{self.partner.id}_{self.user.id}",
                {"type": "send_message", "message": {"type": "chat_message", "message": message}}
            )

    async def send_message(self, event):
        message = event["message"]

        # Send the message to the client
        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def get_user(self):
        return User.objects.get(id=self.user_id)

    @database_sync_to_async
    def get_user_interests(self):
        return self.user.user_set.all().values_list("interest__name", flat=True)

    @database_sync_to_async
    def get_matching_user(self):
        matching_users = User.objects.filter(user_set__interest__name__in=self.user_interests, is_online=True).exclude(
            id=self.user_id).first()
        if matching_users:
            user = matching_users
        else:
            user = User.objects.filter(is_online=True).exclude(id=self.user_id).first()
        return user

    async def send_partner_details(self):
        data = {
            "type": "send_message",
            "message": {
                "name": self.partner.full_name,
                "gender": self.partner.gender,
                "country": self.partner.country,
                "type": "user_details"
            }
        }

        await self.channel_layer.group_send(f'chat_{self.user.id}_{self.partner.id}', data)
