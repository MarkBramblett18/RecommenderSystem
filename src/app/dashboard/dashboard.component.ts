import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

type MovieCard = { title: string, img: string, desc: string, rating: number, imdbID: string }
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

  movieCards: Array<MovieCard>;
  reviewTable: Array<Review>;
  recommendTable: Array<string>;

  constructor(private router: Router, private http: HttpClient) {
    this.message = '';
    this.activeTable = '';
    this.movieCards = [];
    this.reviewTable = [];
    this.recommendTable = [];
    this.addMovie = new FormGroup({
      'review': new FormControl('', Validators.required)
    });
    this.findMovie = new FormGroup({
      'input': new FormControl('', Validators.required),
      'type': new FormControl('', Validators.required)
    })
    this.selectMovie = {title: '', img: '', desc: '', rating: -1, imdbID: ''};
    this.selectedMovie = false;
    this.apiurl = 'http://www.omdbapi.com/?apikey=54e2e839';

    this.recommendTable.push("tt10726286")
    this.recommendTable.push("tt0133093")
    this.recommendTable.push("tt1482967")
    this.recommendTable.push("tt0103923")
    this.reviewTable.push({imdbID:"tt10726286", rating:1})
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
      this.selectMovie = {title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: -1, imdbID: this.movie.imdbID}; //change to setting movie based on api info
    })

  }

  getMovieTitle(title:string){
    this.http.get(this.apiurl + '&t=' + title).subscribe((res)=>{
      this.movie = JSON.parse(JSON.stringify(res));
      console.log(this.movie)
      this.selectMovie = {title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: -1, imdbID: this.movie.imdbID}; //change to setting movie based on api info
    })

  }

  filltable(table:string){
    if(table == 'rev') {
      this.reviewTable.forEach((movie) => {
        this.http.get(this.apiurl + "&i=" + movie.imdbID).subscribe((res)=>{
          this.movie = JSON.parse(JSON.stringify(res));
          console.log(this.movie);
          this.movieCards.push({title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: movie.rating, imdbID: this.movie.imdbID}); //change to setting movie based on api info
        });
      });
    } else
    {
      this.recommendTable.forEach((movie) => {
        this.http.get(this.apiurl + "&i=" + movie).subscribe((res)=>{
          this.movie = JSON.parse(JSON.stringify(res));
          console.log(this.movie);
          this.movieCards.push({title: this.movie.Title, img: this.movie.Poster, desc: this.movie.Plot, rating: -1, imdbID: this.movie.imdbID}); //change to setting movie based on api info
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
    this.selectedMovie = true;
  }

  add(): void {
    this.selectMovie.rating = this.addMovie.get('review');
    this.movieCards.push(this.selectMovie);
    //add review to DB
    this.addMovie.reset();
    this.findMovie.reset();
    this.selectedMovie = false;
  }

  reselect(): void {
    this.selectedMovie = false;
  }

  delete(movie: MovieCard){
    const index = this.movieCards.indexOf(movie, 0);
    this.movieCards.splice(index, 1);
    //delete review from DB
  }
}
