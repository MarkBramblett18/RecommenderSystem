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
    this.movieCards = [];
    //for(const movie in this.reviewTable) {
        //add movie to movieCards
    //}
    const mov1 = {"Title":"Batman vs Captain America","Year":"2020","Rated":"N/A","Released":"31 Mar 2020","Runtime":"4 min","Genre":"Short, Action","Director":"Jace Elton","Writer":"Jace Elton","Actors":"Jace Elton, Angel Padilla, Alejo Vega","Plot":"Batman and Captain America must duke it out to see who the strongest hero is.","Language":"English","Country":"United States","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BYzM1OWRiNTItY2E2Mi00NGQ5LTgyYzItOTY5MWRlMzBlYWQ5XkEyXkFqcGdeQXVyNjY1ODQxNjE@._V1_SX300.jpg","Ratings":[],"Metascore":"N/A","imdbRating":"N/A","imdbVotes":"N/A","imdbID":"tt10726286","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
    const mov2 =   {"Title":"Captain America","Year":"1990","Rated":"PG-13","Released":"26 Jul 1991","Runtime":"97 min","Genre":"Action, Adventure, Sci-Fi","Director":"Albert Pyun","Writer":"Joe Simon, Jack Kirby, Stephen Tolkin","Actors":"Matt Salinger, Ronny Cox, Ned Beatty","Plot":"Frozen in the ice for decades, Captain America is freed to battle against archcriminal The Red Skull.","Language":"English","Country":"United States, Yugoslavia","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BYmRmYzA4NDItZmI3NS00NWIyLWIzZWEtNGIzZjZlYmY5MzE2XkEyXkFqcGdeQXVyMTEyNzgwMDUw._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"3.2/10"},{"Source":"Rotten Tomatoes","Value":"12%"}],"Metascore":"N/A","imdbRating":"3.2","imdbVotes":"14,378","imdbID":"tt0103923","Type":"movie","DVD":"30 Aug 2011","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
    const mov3 = {"Title":"Monsters vs Aliens: Mutant Pumpkins from Outer Space","Year":"2009","Rated":"TV-PG","Released":"28 Oct 2009","Runtime":"26 min","Genre":"Animation, Action, Adventure","Director":"Peter Ramsey","Writer":"Adam F. Goldberg, Conrad Vernon, Rob Letterman","Actors":"Reese Witherspoon, Seth Rogen, Hugh Laurie","Plot":"On Halloween, innocent-looking carved pumpkins reveal themselves for what they really are -- mutant aliens.","Language":"English","Country":"United States","Awards":"1 win & 1 nomination","Poster":"https://m.media-amazon.com/images/M/MV5BMjQ5YjI4MTgtMDdiYi00ZTNlLTkwZTQtMjA3NDhiOWVjZjQ2XkEyXkFqcGdeQXVyNDgyODgxNjE@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.3/10"}],"Metascore":"N/A","imdbRating":"6.3","imdbVotes":"3,045","imdbID":"tt1482967","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
    const mov4 = {"Title":"The Matrix","Year":"1999","Rated":"R","Released":"31 Mar 1999","Runtime":"136 min","Genre":"Action, Sci-Fi","Director":"Lana Wachowski, Lilly Wachowski","Writer":"Lilly Wachowski, Lana Wachowski","Actors":"Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss","Plot":"When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.","Language":"English","Country":"United States, Australia","Awards":"Won 4 Oscars. 42 wins & 51 nominations total","Poster":"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"8.7/10"},{"Source":"Rotten Tomatoes","Value":"88%"},{"Source":"Metacritic","Value":"73/100"}],"Metascore":"73","imdbRating":"8.7","imdbVotes":"1,929,568","imdbID":"tt0133093","Type":"movie","DVD":"15 May 2007","BoxOffice":"$172,076,928","Production":"N/A","Website":"N/A","Response":"True"};
    this.movieCards.push({title: mov1.Title, img: mov1.Poster, desc: mov1.Plot, rating: 0 ,imdbID: mov1.imdbID});
    this.movieCards.push({title: mov2.Title, img: mov2.Poster, desc: mov2.Plot, rating: 0 ,imdbID: mov2.imdbID});
    this.movieCards.push({title: mov3.Title, img: mov3.Poster, desc: mov3.Plot, rating: 0 ,imdbID: mov3.imdbID});
    this.movieCards.push({title: mov4.Title, img: mov4.Poster, desc: mov4.Plot, rating: 0 ,imdbID: mov4.imdbID});
    this.activeTable = 'rev';
  }

  recommendLoad(): void {
    this.movieCards = [];
    //for(const imdbID in this.recommendTable) {
      //add movie to movieCards
    //}
    const mov1 = {"Title":"Batman vs Captain America","Year":"2020","Rated":"N/A","Released":"31 Mar 2020","Runtime":"4 min","Genre":"Short, Action","Director":"Jace Elton","Writer":"Jace Elton","Actors":"Jace Elton, Angel Padilla, Alejo Vega","Plot":"Batman and Captain America must duke it out to see who the strongest hero is.","Language":"English","Country":"United States","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BYzM1OWRiNTItY2E2Mi00NGQ5LTgyYzItOTY5MWRlMzBlYWQ5XkEyXkFqcGdeQXVyNjY1ODQxNjE@._V1_SX300.jpg","Ratings":[],"Metascore":"N/A","imdbRating":"N/A","imdbVotes":"N/A","imdbID":"tt10726286","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
    const mov2 =   {"Title":"Captain America","Year":"1990","Rated":"PG-13","Released":"26 Jul 1991","Runtime":"97 min","Genre":"Action, Adventure, Sci-Fi","Director":"Albert Pyun","Writer":"Joe Simon, Jack Kirby, Stephen Tolkin","Actors":"Matt Salinger, Ronny Cox, Ned Beatty","Plot":"Frozen in the ice for decades, Captain America is freed to battle against archcriminal The Red Skull.","Language":"English","Country":"United States, Yugoslavia","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BYmRmYzA4NDItZmI3NS00NWIyLWIzZWEtNGIzZjZlYmY5MzE2XkEyXkFqcGdeQXVyMTEyNzgwMDUw._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"3.2/10"},{"Source":"Rotten Tomatoes","Value":"12%"}],"Metascore":"N/A","imdbRating":"3.2","imdbVotes":"14,378","imdbID":"tt0103923","Type":"movie","DVD":"30 Aug 2011","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
    const mov3 = {"Title":"Monsters vs Aliens: Mutant Pumpkins from Outer Space","Year":"2009","Rated":"TV-PG","Released":"28 Oct 2009","Runtime":"26 min","Genre":"Animation, Action, Adventure","Director":"Peter Ramsey","Writer":"Adam F. Goldberg, Conrad Vernon, Rob Letterman","Actors":"Reese Witherspoon, Seth Rogen, Hugh Laurie","Plot":"On Halloween, innocent-looking carved pumpkins reveal themselves for what they really are -- mutant aliens.","Language":"English","Country":"United States","Awards":"1 win & 1 nomination","Poster":"https://m.media-amazon.com/images/M/MV5BMjQ5YjI4MTgtMDdiYi00ZTNlLTkwZTQtMjA3NDhiOWVjZjQ2XkEyXkFqcGdeQXVyNDgyODgxNjE@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.3/10"}],"Metascore":"N/A","imdbRating":"6.3","imdbVotes":"3,045","imdbID":"tt1482967","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
    const mov4 = {"Title":"The Matrix","Year":"1999","Rated":"R","Released":"31 Mar 1999","Runtime":"136 min","Genre":"Action, Sci-Fi","Director":"Lana Wachowski, Lilly Wachowski","Writer":"Lilly Wachowski, Lana Wachowski","Actors":"Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss","Plot":"When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.","Language":"English","Country":"United States, Australia","Awards":"Won 4 Oscars. 42 wins & 51 nominations total","Poster":"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"8.7/10"},{"Source":"Rotten Tomatoes","Value":"88%"},{"Source":"Metacritic","Value":"73/100"}],"Metascore":"73","imdbRating":"8.7","imdbVotes":"1,929,568","imdbID":"tt0133093","Type":"movie","DVD":"15 May 2007","BoxOffice":"$172,076,928","Production":"N/A","Website":"N/A","Response":"True"};
    this.movieCards.push({title: mov4.Title, img: mov4.Poster, desc: mov4.Plot, rating: 0 ,imdbID: mov4.imdbID});
    this.movieCards.push({title: mov1.Title, img: mov1.Poster, desc: mov1.Plot, rating: 0 ,imdbID: mov1.imdbID});
    this.movieCards.push({title: mov2.Title, img: mov2.Poster, desc: mov2.Plot, rating: 0 ,imdbID: mov2.imdbID});
    this.movieCards.push({title: mov3.Title, img: mov3.Poster, desc: mov3.Plot, rating: 0 ,imdbID: mov3.imdbID});
    this.activeTable = 'rec';
  }

  search(): void {
    /**if(this.findMovie.get('type') == 'id'){
      //request api for info using imdbID
      this.selectMovie = {title: '', img: '', desc: '', rating: -1, imdbID: ''}; //change to setting movie based on api info
    } else
    {
      //request api for info using title
      this.selectMovie = {title: '', img: '', desc: '', rating: -1, imdbID: ''}; //change to setting movie based on api info
    }**/
    const mov1 = {"Title":"Batman vs Captain America","Year":"2020","Rated":"N/A","Released":"31 Mar 2020","Runtime":"4 min","Genre":"Short, Action","Director":"Jace Elton","Writer":"Jace Elton","Actors":"Jace Elton, Angel Padilla, Alejo Vega","Plot":"Batman and Captain America must duke it out to see who the strongest hero is.","Language":"English","Country":"United States","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BYzM1OWRiNTItY2E2Mi00NGQ5LTgyYzItOTY5MWRlMzBlYWQ5XkEyXkFqcGdeQXVyNjY1ODQxNjE@._V1_SX300.jpg","Ratings":[],"Metascore":"N/A","imdbRating":"N/A","imdbVotes":"N/A","imdbID":"tt10726286","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
    this.selectMovie = {title: mov1.Title, img: mov1.Poster, desc: mov1.Plot, rating: 0 ,imdbID: mov1.imdbID};
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
