from django.urls import include, path
from api import views

urlpatterns = [
  path('books', views.book),
]