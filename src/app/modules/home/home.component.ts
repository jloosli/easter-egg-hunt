import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {EggsService} from '../../services/eggs.service';
import {map, take} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  vm$: Observable<{ eggs: string[], total: number }>;

  constructor(private eggsSvc: EggsService, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
  ) {
    this.vm$ = combineLatest([this.eggsSvc.eggs$]).pipe(
      map(([eggs]) => ({eggs, total: this.eggsSvc.totalEggs})),
    );
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      take(1),
    ).subscribe((params: ParamMap) => {
      if (params.has('egg')) {
        this.eggsSvc.addEgg(params.get('egg'));
      }
      if (params.has('reset')) {
        this.eggsSvc.removeEggs();
      }
    });
  }

  addEgg(id) {
    this.eggsSvc.addEgg(id);
    this.cdr.detectChanges();
  }

}
