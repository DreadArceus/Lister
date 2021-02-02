from django.http.response import JsonResponse
from django.http.request import HttpRequest
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import api_view

from .models import List, Secret
from .serializers import ListSerializer, SecretSerializer


@api_view(['GET', 'POST'])
def view_list(request: HttpRequest, name: str, password: str = '', author: str = ''):
    if request.method == 'GET':
        try:
            list_object = List.objects.get(name=name)
            list_serializer = ListSerializer(list_object)
            if password:
                secret_object = Secret.objects.get(name=name)
                secret_serializer = SecretSerializer(secret_object)
                if password != secret_serializer.data['password']:
                    return JsonResponse({'error': 'incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)
            return JsonResponse(list_serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'list does not exist'}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'POST':
        if password == '' or author == '':
            return JsonResponse({'error': 'insufficient parameters'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            List.objects.get(name=name)
            return JsonResponse({'error': 'list already exists'}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            list_serializer = ListSerializer(
                data={'name': name, 'author': author})
            secret_serializer = SecretSerializer(
                data={'name': name, 'password': password})
            if list_serializer.is_valid():
                list_serializer.save()
                if secret_serializer.is_valid():
                    secret_serializer.save()
                    return JsonResponse(list_serializer.data, status=status.HTTP_201_CREATED)
                return JsonResponse(secret_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return JsonResponse(list_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def save_list(request: HttpRequest, name: str, password: str):
    try:
        list_object = List.objects.get(name=name)
        secret_object = Secret.objects.get(name=name)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'list does not exist'}, status=status.HTTP_404_NOT_FOUND)
    list_serializer = ListSerializer(list_object)
    secret_serializer = SecretSerializer(secret_object)
    if password != secret_serializer.data['password']:
        return JsonResponse({'error': 'incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        request.data['list_items']
    except KeyError:
        return JsonResponse({'error': 'list_items not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    if list_serializer.data['list_items'] != request.data['list_items']:
        new_data = list_serializer.data
        new_data['list_items'] = request.data['list_items']
        list_serializer = ListSerializer(list_object, data=new_data)
        if list_serializer.is_valid():
            list_serializer.save()
            return JsonResponse({'msg': 'successful'}, status=status.HTTP_200_OK)
        return JsonResponse(list_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse({'msg': 'no modification detected'}, status=status.HTTP_304_NOT_MODIFIED)
