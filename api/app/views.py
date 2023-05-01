from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, MovieSerializer, RatingSerializer
from .models import User, Movie, Rating
from django.conf import settings
import jwt, datetime

# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
            'id': user.user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(user_id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
    
class SearchView(APIView):
    def get(self, request):
        title = request.data['title']
        if not title.strip():
            content = {'message': 'No movie with this title'}
            return Response(content)

        if title is not None:
            collected = Movie.objects.filter(title__icontains=title)
            if collected.exists():
                serializer = MovieSerializer(collected, many=True)
                return Response(serializer.data)
            else:
                content = {'message': 'No movie with this title'}
                return Response(content)
                        
class RatingView(APIView):
    def post(self, request):
        movie_id = request.data['movie_id']
        if movie_id is not None:
            try:
                rating = request.data['rating']
                if rating is not None:
                    movie = Movie.objects.get(pk=movie_id)
                
                    movie_rating_object = Rating.objects.filter(user=request.user, movie=movie).exists()
                    if movie_rating_object:
                        Rating.objects.filter(user=request.user, movie=movie).update(rating=rating)
                        content = {'message': 'Rating has been updated'}
                        return Response(content)
                    else:
                        Rating.objects.create(user=request.user, movie=movie, rating=rating)
                        content = {'message': 'Rating has been created'}
                        return Response(content)
                else:
                    content = {'error': 'Rating field is missing'}
                    return Response(content)
            except Movie.DoesNotExist:
                content = {'error': 'Movie does not exist'}
                return Response(content)
        else:
            content = {'error': 'Movie id is empty'}
            return Response(content)