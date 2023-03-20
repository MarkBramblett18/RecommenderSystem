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



}
