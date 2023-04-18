from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser as User
from .models import Interests
from .serializers import InterestsSerializer, UserSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        refresh = RefreshToken.for_user(User.objects.get(pk=serializer.data["id"]))
        user = serializer.data
        user["refresh"] = str(refresh)
        user["access"] = str(refresh.access_token)
        user.pop("password")
        response = Response(user, status=status.HTTP_201_CREATED)
        return response


class LoginView(APIView):
    def post(self, request):
        try:
            if email := request.data.pop("email", None):
                user = User.objects.filter(email=email).first()
            elif phone := request.data.pop("phone", None):
                user = User.objects.filter(phone=phone).first()

            if user:
                if user.check_password(request.data.pop("password")):
                    refresh = RefreshToken.for_user(user)
                    serializer = UserSerializer(user)
                    user = serializer.data
                    user["refresh"] = str(refresh)
                    user["access"] = str(refresh.access_token)
                    user.pop("password")
                    response = Response(user, status=status.HTTP_200_OK)
                else:
                    response = Response(
                        "Invalid Credentials", status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                response = Response(
                    "No user exits with give phone/email",
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            response = Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            return response


class UserDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class InterestsListView(APIView):
    def get(self, request):
        try:
            my_objects = Interests.objects.all()
            serializer = InterestsSerializer(my_objects, many=True)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OnlineStatusView(APIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ["post"]

    def post(self, request):
        user = request.user
        user.is_online = not user.is_online
        user.save()
        return Response({"is_online": user.is_online}, status=status.HTTP_200_OK)
