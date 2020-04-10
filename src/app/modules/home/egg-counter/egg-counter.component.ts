import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-egg-counter',
  templateUrl: './egg-counter.component.html',
  styleUrls: ['./egg-counter.component.scss'],
})
export class EggCounterComponent implements OnInit {

  @Input() found: string[] = [];
  @Input() total: number = 0;


  constructor() {
  }

  ngOnInit(): void {
  }

}
