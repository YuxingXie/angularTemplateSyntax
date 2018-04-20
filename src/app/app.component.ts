import { Component } from '@angular/core';
import {Hero} from './Hero';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public currentHero = new Hero(1, 'JJJ');
  deleteHero(hero: Hero) {
    console.log(hero.name);
  }
}
