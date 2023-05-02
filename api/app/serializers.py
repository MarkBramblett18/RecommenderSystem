from rest_framework import serializers
from .models import User, Movie, Rating, Link


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['movie_id', 'title', 'genre']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['rating', 'movie_id', 'user_id']

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ['movie_id', 'imdb_id', 'tmdb_id']