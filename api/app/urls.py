from django.urls import path
from . import views
from .views import RegisterView, LoginView, UserView, LogoutView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('movie/<int:movie_id>', views.movie),
    path('recommend/<int:user_id>', views.recommend),
    path('search/<str:title>', views.search),
    path('rating/<int:user_id>/<int:movie_id>', views.rating),
    path('rated/<int:user_id>', views.rated),
]