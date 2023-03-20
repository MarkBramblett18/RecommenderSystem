import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

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

  movieCards: Array<MovieCard>;
  reviewTable: Array<Review>
  recommendTable: Array<string>

  constructor(private router: Router) {
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
  }

  ngOnInit(): void {

  }


  reviewLoad(): void {
    this.activeTable = 'rev';
    this.movieCards = [];
    for(const movie in this.reviewTable) {
      //request movie information from api
      this.movieCards.push ({
        //add movie to movieCards
      })
    }
  }

  recommendLoad(): void {
    this.activeTable = 'rec';
    this.movieCards = [];
    for(const imdbID in this.recommendTable) {
      //request movie information from api
      this.movieCards.push ({
        //add movie to movieCards
      })
    }
  }

  search(): void {
    if(this.findMovie.get('type') == 'id'){
      //request api for info using imdbID
      this.selectMovie = {title: '', img: '', desc: '', rating: -1, imdbID: ''}; //change to setting movie based on api info
    } else
    {
      //request api for info using title
      this.selectMovie = {title: '', img: '', desc: '', rating: -1, imdbID: ''}; //change to setting movie based on api info
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

  delete(movie: MovieCard){
    const index = this.movieCards.indexOf(movie, 0);
    this.movieCards.splice(index, 1);
    //delete review from DB
  }
}
