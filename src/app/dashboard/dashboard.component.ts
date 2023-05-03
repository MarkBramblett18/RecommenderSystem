import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {Emitters} from "../emitters/emitters";

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

  recommended: Array<any>;
  rated: Array<any>;
  user: any;
  apiRating: any;

  movie: any;
  apiurl: any;
  searchMSG: string;

  movieCards: Array<MovieCard>;
  reviewTable: Array<Review>;
  recommendTable: Array<string>;

  constructor(private router: Router, private http: HttpClient) {
    this.recommended = [];
    this.apiRating = '';
    this.user = '';
    this.rated = [];
    this.searchMSG = '';
    this.message = '';
    this.activeTable = '';
    this.movieCards = [];
    this.reviewTable = [];
    this.recommendTable = [];
    this.addMovie = new FormGroup({
      'rating': new FormControl(0, Validators.min(1) )
    });
    this.findMovie = new FormGroup({
      'input': new FormControl('', Validators.required),
      'type': new FormControl('', Validators.required),
      'year': new FormControl('')
    })
    this.selectMovie = {title: '', img: '', desc: '', rating: -1, imdbID: '', director: '', runtime: '',  genre: ''};
    this.selectedMovie = false;
    this.apiurl = 'http://www.omdbapi.com/?apikey=54e2e839';
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.http.get('http://localhost:8000/user', {withCredentials: true}).subscribe(
      (res: any) => {
        Emitters.authEmitter.emit(true);
        this.user = JSON.parse(JSON.stringify(res));
        this.getRated();
      },
      err => {
        Emitters.authEmitter.emit(false);
        this.router.navigate(['/home']);
      }
    );
  }

  getRated(){
    this.http.get('http://localhost:8000/rated/'+this.user.user_id, {withCredentials: true}).subscribe(
      (res: any) => {
        this.rated = JSON.parse(JSON.stringify(res));
        this.parseRated();
      },
      err => {
        console.log("error");
      }
    );
  }

  parseRated(){
    this.rated.forEach((rating) => {
      this.http.get('http://localhost:8000/movie/' + rating.movie_id).subscribe((res)=>{
        this.apiRating = JSON.parse(JSON.stringify(res));
        let imdbID: String = this.apiRating.imdb_id
        for(let i = 9; i>JSON.stringify(imdbID).length ;) {
          imdbID = "0" + imdbID;
        }
        this.reviewTable.push({imdbID: "tt" + imdbID, rating: rating.rating}); //add to review table
      });
    });
  }

  getMovieIMDBID(id: string){
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

  getMovieTitleYear(title:string, year:string){
    this.http.get(this.apiurl + '&t=' + title + '&y=' + year).subscribe((res)=>{
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
    this.resetAddMovie();
    this.findMovie.reset();
    this.selectedMovie = false;
    this.movieCards = [];

    this.recommendTable = [];
    //this.recommendPull();
    this.activeTable = 'rec';

  }

  recommendParse() {
    this.recommended.forEach((recommend) => {
      this.http.get('http://localhost:8000/movie/' + recommend.movie_id).subscribe((res)=>{
        this.apiRating = JSON.parse(JSON.stringify(res));
        let imdbID: String = this.apiRating.imdb_id
        for(let i = 9; i>JSON.stringify(imdbID).length ;) {
          imdbID = "0" + imdbID;
        }
        this.recommendTable.push("tt" + imdbID); //add to recommend table
      });
    });
  }

  recommendPull() {
    this.http.post('http://localhost:8000/recommend/'+this.user.user_id, {withCredentials: true}).subscribe(
      (res: any) => {
        this.recommended = JSON.parse(JSON.stringify(res));
        this.recommendParse();
      },
      err => {
        console.log("error");
      }
    );
  }

  search(): void {
    if(this.findMovie.value.type == 'id'){
      this.getMovieIMDBID(this.findMovie.value.input);
    } else if(this.findMovie.value.type == 'title') {
      if(this.findMovie.value.year == ''){
        this.getMovieTitle(this.findMovie.value.input);
      } else {
        this.getMovieTitleYear(this.findMovie.value.input, this.findMovie.value.year);
      }
    }
    this.searchMSG = '';
  }

  add(): void {
    let added = false;
    if(!(this.addMovie.value.rating>0)){
      this.searchMSG = 'A star rating is required to add a movie.';
    } else {
      this.searchMSG = '';
      this.selectMovie.rating = this.addMovie.value.rating;
      this.movieCards.forEach((movie) => {
        if (movie.imdbID == this.selectMovie.imdbID) {
          added = true;
        }
      });
      if (added) {
        this.removeExisting();
        this.addReview(this.selectMovie.title);
      } else {
        this.addReview(this.selectMovie.title);
        //add review to DB ensure to div selectMovie.rating by 2
        this.findMovie.reset();
        this.selectedMovie = false;
      }
    }
  }

  removeExisting() {
    this.movieCards.forEach((movie) => {
      if (movie.imdbID == this.selectMovie.imdbID) {
        const index = this.movieCards.indexOf(movie, 0);
        this.movieCards.splice(index, 1);
      }
    });
  }

  addReview(title:string) {
    this.http.get('http://localhost:8000/search/'+title, {withCredentials: true}).subscribe(
      (res: any) => {
        console.log(JSON.parse(JSON.stringify(res)));
        if(JSON.parse(JSON.stringify(res)).message == "No movie with this title")
          this.searchMSG = "Movie not in database yet.";
          else this.addReview2(JSON.parse(JSON.stringify(res))[0].movie_id);
      },
      err => {
        console.log("error");
      }
    );
  }

  addReview2(movieID:any) {
    this.http.post('http://localhost:8000/rating/'+this.user.user_id+'/'+movieID, this.addMovie.getRawValue()).subscribe(
      (res: any) => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.movieCards.push(this.selectMovie);
        this.resetAddMovie();
      },
      err => {

      }
    );
  }

  resetAddMovie(): void {
    this.addMovie.get('rating').setValue(0);
  }

  reselect(): void {
    this.selectedMovie = false;
    if(this.searchMSG != 'Movie not in database yet.') {
      this.searchMSG = '';
    }
    this.resetAddMovie();
  }
}
