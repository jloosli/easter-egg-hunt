import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {EggsService} from '../../services/eggs.service';
import {map, take} from 'rxjs/operators';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  vm$: Observable<{ eggs: string[], total: number }>;
  celebrating = false;
  stopEvent = 0;
  isFound = true;

  constructor(private eggsSvc: EggsService, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
              private router: Router,
  ) {
    this.vm$ = combineLatest([this.eggsSvc.eggs$]).pipe(
      map(([eggs]) => ({eggs, total: this.eggsSvc.totalEggs})),
    );

    window['celebrate'] = (val) => this.celebrate(val);
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      take(1),
    ).subscribe((params: ParamMap) => {
      if (params.has('egg')) {
        this.eggsSvc.addEgg(params.get('egg'));
        this.router.navigate(['/']);
      }
      if (params.has('reset')) {
        this.eggsSvc.removeEggs();
        this.router.navigate(['/']);
      }
    });
  }

  addEgg(id) {
    const foundEgg = this.eggsSvc.addEgg(id);
    this.celebrate(!!foundEgg);
    this.cdr.detectChanges();
  }

  celebrate(isNew: boolean) {
    debugger;
    this.isFound = isNew;
    this.stopEvent = Math.random();
    this.celebrating = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.celebrating = false;
      this.cdr.detectChanges();
    }, 3000);
  }

}
