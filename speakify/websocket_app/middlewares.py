import base64

from channels.auth import AuthMiddlewareStack
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt import InvalidTokenError, decode
from rest_framework_simplejwt.exceptions import InvalidToken

User = get_user_model()


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        try:
            encoded_token = scope["query_string"].decode()[14:]
            token = base64.urlsafe_b64decode(encoded_token.strip('"')).decode("utf-8")
            decoded_data = decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = await self.get_user(decoded_data)
            if user is None:
                pass
            scope["user"] = user
        except (InvalidTokenError, InvalidToken):
            pass

        return await self.inner(scope, receive, send)


def TokenAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))


async def get_user(decoded_data):
    user_id = decoded_data["user_id"]
    try:
        user = await User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        return None
