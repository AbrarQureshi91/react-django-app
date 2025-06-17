from rest_framework import serializers
from accounts.models import CustomUser


class Registerserializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only = True)
    class Meta:
        model = CustomUser
        fields = ['username'  , 'password' , 'password2' , 'role']
    

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Password Must Match')
        return data
    

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username= validated_data['username'],
            password= validated_data['password'],
            role = validated_data['role'],
        )
        return user
       
