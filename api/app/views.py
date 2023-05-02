from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from .models import User, Movie, Rating, Link
from .serializers import UserSerializer, MovieSerializer, RatingSerializer, LinkSerializer
from django.conf import settings
import jwt, datetime

from typing import Dict, Text
import numpy as np
import pandas as pd
import tensorflow as tf
#import tensorflow_datasets as tfds
import tensorflow_recommenders as tfrs

def tensorflow(id):
    # Ratings data.
    #ratings = tfds.load('movielens/100k-ratings', split="train")
    # Features of all the available movies.
    #movies = tfds.load('movielens/100k-movies', split="train")
    rmovie_id = np.array(Rating.objects.all().values_list('movie', flat=True)).astype('str')
    ruser_id = np.array(Rating.objects.all().values_list('user', flat=True)).astype('str')
    rdf = pd.DataFrame({"movie_id":rmovie_id, "user_id":ruser_id})
    ratings = tf.data.Dataset.from_tensor_slices(rdf[['movie_id', 'user_id']])

    movie_id = np.array(Movie.objects.all().values_list('movie_id', flat=True)).astype('str')
    df = pd.DataFrame({"movie_id":movie_id})
    movies = tf.data.Dataset.from_tensor_slices(df[['movie_id']])

    # Select the basic features.
    ratings = ratings.map(lambda x: {"movie_id": x[0], "user_id": x[1]})

    movies = movies.map(lambda x: x[0])
    
 
    user_ids_vocabulary = tf.keras.layers.StringLookup(mask_token=None)
    user_ids_vocabulary.adapt(ratings.map(lambda x: x["user_id"]))

    movie_titles_vocabulary = tf.keras.layers.StringLookup(mask_token=None)
    movie_titles_vocabulary.adapt(movies)

    # Define user and movie models.
    user_model = tf.keras.Sequential([
        user_ids_vocabulary,
        tf.keras.layers.Embedding(user_ids_vocabulary.vocabulary_size(), 64)
    ])
    movie_model = tf.keras.Sequential([
        movie_titles_vocabulary,
        tf.keras.layers.Embedding(movie_titles_vocabulary.vocabulary_size(), 64)
    ])

    # Define your objectives.
    task = tfrs.tasks.Retrieval(metrics=tfrs.metrics.FactorizedTopK(
        movies.batch(128).map(movie_model)
    )
    )

    # Create a retrieval model.
    model = MovieLensModel(user_model, movie_model, task)
    model.compile(optimizer=tf.keras.optimizers.Adagrad(0.5))

    # Train for 3 epochs.
    model.fit(ratings.batch(4096), epochs=3)

    # Use brute-force search to set up retrieval using the trained representations.
    index = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
    index.index_from_dataset(
        movies.batch(100).map(lambda title: (title, model.movie_model(title))))

    # Get some recommendations.
    _, titles = index(np.array([str(id)]))
    return titles[0, :5].numpy().astype('str')
        
class MovieLensModel(tfrs.Model):
  # We derive from a custom base class to help reduce boilerplate. Under the hood,
  # these are still plain Keras Models.

  def __init__(
      self,
      user_model: tf.keras.Model,
      movie_model: tf.keras.Model,
      task: tfrs.tasks.Retrieval):
    super().__init__()

    # Set up user and movie representations.
    self.user_model = user_model
    self.movie_model = movie_model

    # Set up a retrieval task.
    self.task = task

  def compute_loss(self, features: Dict[Text, tf.Tensor], training=False) -> tf.Tensor:
    # Define how the loss is computed.

    user_embeddings = self.user_model(features["user_id"])
    movie_embeddings = self.movie_model(features["movie_id"])

    return self.task(user_embeddings, movie_embeddings)

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
    
@api_view(['POST'])
def recommend(request, user_id):
    if request.method == 'POST':
        if user_id is not None:
            if User.objects.filter(user_id=user_id).exists():
                movies = Movie.objects.filter(movie_id__in=tensorflow(user_id))
                serializer = MovieSerializer(movies, many=True)
                return Response(serializer.data)
            else:
                content = {'message': 'No user with this id'}
                return Response(content)
        else:
            content = {'message': 'Bad request'}
            return Response(content)
    else:
        content = {'message': 'Method not allowed'}
        return Response(content)

@api_view(['GET'])
def movie(request, movie_id):
    if request.method == 'GET':
        if movie_id is not None:
            if Movie.objects.filter(movie_id=movie_id).exists():
                serializer = LinkSerializer(Link.objects.get(movie_id=movie_id))
                return Response(serializer.data)
            else:
                content = {'message': 'No movie with this id'}
                return Response(content)
        else:
            content = {'message': 'Bad request'}
            return Response(content)
    else:
        content = {'message': 'Method not allowed'}
        return Response(content)

@api_view(['GET'])
def search(request, title):
    if request.method == 'GET':
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

@api_view(['POST'])
def rating(request, user_id, movie_id):
    if request.method == 'POST':
        if movie_id is not None:
            try:
                if 'rating' in request.data:
                    movie = Movie.objects.get(pk=movie_id)
                    if 'rating' in request.data:
                        rating = request.data.get('rating')
                    else:
                        rating = None
                        
                    user = User.objects.get(pk=user_id)
                    movie_rating_object = Rating.objects.filter(user=user, movie=movie).exists()
                    if movie_rating_object:
                        Rating.objects.filter(user=user, movie=movie).update(rating=rating)
                        content = {'message': 'Rating has been updated'}
                        return Response(content)
                    else:
                        Rating.objects.create(user=user, movie=movie, rating=rating)
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
    else:
        content = {'error': 'Bad Request'}
        return Response(content)
    
@api_view(['GET'])
def rated(request, user_id):
    if request.method == 'GET':
        user = User.objects.get(pk=user_id)
        rating = Rating.objects.filter(user=user)
        if rating.exists():
            serializer = RatingSerializer(rating, many=True)
            return Response(serializer.data)
        else:
            content = {'error': 'User has no rating'}
            return Response(content)