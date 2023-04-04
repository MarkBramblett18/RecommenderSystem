import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

type MovieCard = { title: string, img: string, desc: string, rating: number, imdbID: string, director: string, runtime: string,  genre: string}
type Review = { imdbID: string, rating: number}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  message: string;
  activeTable: string;
  findMovie: any;
  addMovie: any;
  selectedMovie: boolean;
  selectMovie: MovieCard;

  movie: any;
  apiurl: any;
  searchMSG: string;

  movieCards: Array<MovieCard>;
  reviewTable: Array<Review>;
  recommendTable: Array<string>;

  starRating: number;

  constructor(private router: Router, private http: HttpClient) {
    this.starRating = 0;
    this.searchMSG = '';
    this.message = '';
    this.activeTable = '';
    this.movieCards = [];
    this.reviewTable = [];
    this.recommendTable = [];
    this.addMovie = new FormGroup({
      'review': new FormControl(0, Validators.min(1) )
    });
    this.findMovie = new FormGroup({
      'input': new FormControl('', Validators.required),
      'type': new FormControl('', Validators.required)
    })
    this.selectMovie = {title: '', img: '', desc: '', rating: -1, imdbID: '', director: '', runtime: '',  genre: ''};
    this.selectedMovie = false;
    this.apiurl = 'http://www.omdbapi.com/?apikey=54e2e839';

    this.recommendTable.push("tt10726286")
    this.recommendTable.push("tt0133093")
    this.recommendTable.push("tt1482967")
    this.recommendTable.push("tt0103923")
    this.recommendTable.push("tt1482967")
    this.recommendTable.push("tt0103923")
    this.reviewTable.push({imdbID:"tt10726286", rating:1.5})
    this.reviewTable.push({imdbID:"tt0133093", rating:2})
    this.reviewTable.push({imdbID:"tt1482967", rating:4})
    this.reviewTable.push({imdbID:"tt0103923", rating:5})
  }

  ngOnInit(): void {

  }

  getMovieID(id:string){
    this.http.get(this.apiurl + "&i=" + id).subscribe((res)=>{
      this.movie = JSON.parse(JSON.stringify(res));
      console.log(this.movie);
      this.selectMovie = {title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: -1, imdbID: this.movie.imdbID, director: this.movie.Director, runtime: this.movie.Runtime,  genre: this.movie.Genre}; //change to setting movie based on api info
      if(this.movie.Response != 'False'){
        this.selectedMovie = true; }
      else {
        this.searchMSG = 'Could not find a movie with that IMDB ID.';
      }
    })
  }

  getMovieTitle(title:string){
    this.http.get(this.apiurl + '&t=' + title).subscribe((res)=>{
      this.movie = JSON.parse(JSON.stringify(res));
      console.log(this.movie)
      this.selectMovie = {title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: -1, imdbID: this.movie.imdbID, director: this.movie.Director, runtime: this.movie.Runtime,  genre: this.movie.Genre}; //change to setting movie based on api info
      if(this.movie.Response != 'False'){
        this.selectedMovie = true; }
      else {
        this.searchMSG = 'Could not find a movie with that title.';
      }
    })
  }

  filltable(table:string){
    if(table == 'rev') {
      this.reviewTable.forEach((movie) => {
        this.http.get(this.apiurl + "&i=" + movie.imdbID).subscribe((res)=>{
          this.movie = JSON.parse(JSON.stringify(res));
          console.log(this.movie);
          this.movieCards.push({title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: movie.rating*2, imdbID: this.movie.imdbID, director: this.movie.Director, runtime: this.movie.Runtime,  genre: this.movie.Genre}); //change to setting movie based on api info
        });
      });
    } else
    {
      this.recommendTable.forEach((movie) => {
        this.http.get(this.apiurl + "&i=" + movie).subscribe((res)=>{
          this.movie = JSON.parse(JSON.stringify(res));
          console.log(this.movie);
          this.movieCards.push({title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: -1, imdbID: this.movie.imdbID, director: this.movie.Director, runtime: this.movie.Runtime,  genre: this.movie.Genre}); //change to setting movie based on api info
        });
      });
    }
  }


  reviewLoad(): void {
    this.movieCards = [];

    this.filltable('rev');
    this.activeTable = 'rev';
  }

  recommendLoad(): void {
    this.searchMSG = '';
    this.starRating = 0;
    this.resetAddMovie();
    this.findMovie.reset();
    this.selectedMovie = false;
    this.movieCards = [];

    this.filltable('rec');
    this.activeTable = 'rec';
  }

  search(): void {
    if(this.findMovie.value.type == 'id'){
      this.getMovieID(this.findMovie.value.input);
    } else
    {
      this.getMovieTitle(this.findMovie.value.input);
    }
    this.searchMSG = '';
  }

  add(): void {
    let added = false;
    if(!(this.addMovie.value.review>0)){
      this.searchMSG = 'A star rating is required to add a movie.';
    } else {
      this.searchMSG = '';
      this.selectMovie.rating = this.addMovie.value.review;
      //this.selectMovie.rating = this.starRating;
      this.movieCards.forEach((movie) => {
        if (movie.imdbID == this.selectMovie.imdbID) {
          added = true;
        }
      });
      if (added) {
        this.searchMSG = 'Movie already reviewed.';
      } else {
        this.movieCards.push(this.selectMovie);
        //add review to DB ensure to div selectMovie.rating by 2
        this.starRating = 0;
        this.resetAddMovie();
        this.findMovie.reset();
        this.selectedMovie = false;
      }
    }
  }

  resetAddMovie(): void {
    this.addMovie.get('review').setValue(0);
  }

  reselect(): void {
    this.selectedMovie = false;
    this.searchMSG = '';
  }

  delete(movie: MovieCard){
    const index = this.movieCards.indexOf(movie, 0);
    this.movieCards.splice(index, 1);
    //delete review from DB
  }
}
