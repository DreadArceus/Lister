from django.conf.urls import url
from .views import view_list, save_list

urlpatterns = [
    url(r'^list/(?P<name>[0-z ]+)(/(?P<password>[0-z ]+))?(/(?P<author>[0-z ]+))?$', view_list),
    url(r'^save/(?P<name>[0-z ]+)/(?P<password>[0-z ]+)$', save_list)
]
