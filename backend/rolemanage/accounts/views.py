from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken 
from accounts.models import CustomUser
from .serializers import Registerserializer


@api_view(['POST'])
def register_view(request):
    serializer = Registerserializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "User Created Successfully",
            "status": True
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    user = CustomUser.objects.filter(username=username).first()
    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user" : {
                'id' : user.id,
                'username' : user.username,
                'role': user.role

            }
            
        }, status=status.HTTP_200_OK)
    
    return Response({"message": "Invalid Credential"}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    serializer = Registerserializer(user)
    return Response(serializer.data)
