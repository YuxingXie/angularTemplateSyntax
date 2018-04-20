import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Hero} from '../Hero';

@Component({
  selector: 'app-hero-detail',
  template: `<div><button (click)="delete()">Delete</button></div>`,
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Output() deleteRequest: EventEmitter<Hero> = new EventEmitter<Hero>();
  @Input() hero: Hero;
  delete() {
    console.log('HeroDetailComponent.delete invoke');
    this.deleteRequest.emit(this.hero);
  }
  constructor() { }

  ngOnInit() {
  }

}
