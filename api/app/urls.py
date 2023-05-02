from django.urls import path
from . import views
from .views import RegisterView, LoginView, UserView, LogoutView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('movie/<int:movie_id>', views.movie),
    path('recommend', views.recommend),
    path('search/<str:title>', views.search),
    path('rating/<int:movie_id>', views.rating),
    path('rated', views.rated),
]