import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Emitters} from '../emitters/emitters';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.http.get('http://localhost:8000/user', {withCredentials: true}).subscribe(
      (res: any) => {
        Emitters.authEmitter.emit(true);
      },
      err => {
        Emitters.authEmitter.emit(false);
      }
    );
  }

}
