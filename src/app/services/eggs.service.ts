import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import * as localforage from 'localforage';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EggsService {

  totalEggs = 2;
  private _eggs$ = new ReplaySubject<Set<string>>();
  eggs$: Observable<string[]> = this._eggs$.pipe(
    map(eggsSet => Array.from(eggsSet)),
  );

  constructor() {
    localforage.getItem<Set<string>>('eggs').then(eggs => {
      if (eggs) {
        this._eggs$.next(eggs);
      } else {
        this._eggs$.next(new Set());
      }
    });
  }

  async addEgg(url: string) {
    const eggId = this.cleanedEggId(url);
    if (!eggId) {
      return false;
    }
    this._eggs$.pipe(take(1)).subscribe(eggs => {
      eggs.add(eggId as string);
      this._eggs$.next(eggs);
      localforage.setItem<Set<string>>('eggs', eggs);
    });

    return true;
  }

  removeEggs() {
    localforage.removeItem('eggs');
    this._eggs$.next(new Set());
  }

  cleanedEggId(maybeEgg: string): string | boolean {
    if (maybeEgg) {
      try {
        const url = new URL(maybeEgg);
        if (url.searchParams.has('egg')) {
          return url.searchParams.get('egg');
        }
      } catch {
      }
      return maybeEgg;
    }
    return false;
  }

}
