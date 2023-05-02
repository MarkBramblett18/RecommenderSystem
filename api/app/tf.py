


from typing import Dict, Text
import numpy as np
import tensorflow as tf
import tensorflow_datasets as tfds
import tensorflow_recommenders as tfrs

def tensorflow(id):
    # Ratings data.
    ratings = tfds.load('movielens/100k-ratings', split="train")
    # Features of all the available movies.
    movies = tfds.load('movielens/100k-movies', split="train")
    print(movies)
    # Select the basic features.
    ratings = ratings.map(lambda x: {
        "movie_title": x["movie_title"],
        "user_id": x["user_id"]
    })
    movies = movies.map(lambda x: x["movie_title"])

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
    model.fit(ratings.batch(4096), epochs=1)

    # Use brute-force search to set up retrieval using the trained representations.
    index = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
    index.index_from_dataset(
        movies.batch(100).map(lambda title: (title, model.movie_model(title))))

    # Get some recommendations.
    _, titles = index(np.array([id]))
    return titles[0, :3].numpy().astype('str')
        
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
    movie_embeddings = self.movie_model(features["movie_title"])

    return self.task(user_embeddings, movie_embeddings)
  
print(tensorflow("1"))