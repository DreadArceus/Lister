from django.db import models
from django.contrib.postgres.fields import ArrayField


def get_init_list() -> list:
    return [{'text': 'This is a new list', 'key': 0}]


class List(models.Model):
    name = models.CharField(max_length=40)
    author = models.CharField(max_length=40)
    list_items = ArrayField(
        models.JSONField(),
        default=get_init_list
    )


class Secret(models.Model):
    name = models.CharField(max_length=40)
    password = models.CharField(max_length=40)
