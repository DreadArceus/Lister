from rest_framework import serializers
from .models import List, Secret

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['name', 'author', 'list_items']

class SecretSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secret
        fields = ['name', 'password']