import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import * as localforage from 'localforage';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EggsService {

  totalEggs = 32;
  private _eggs$ = new ReplaySubject<Set<string>>();
  eggs$: Observable<string[]> = this._eggs$.pipe(
    map(eggsSet => Array.from(eggsSet)),
  );

  constructor() {
    localforage.getItem<string[]>('eggs').then(eggs => {
      if (eggs) {
        this._eggs$.next(new Set<string>(eggs));
      } else {
        this._eggs$.next(new Set<string>());
      }
    }).catch(() => {
      this._eggs$.next(new Set<string>());
    });
  }

  async addEgg(url: string) {
    const eggId = this.cleanedEggId(url);
    if (!eggId) {
      return false;
    }
    const eggs: Set<string> = await this._eggs$.pipe(take(1)).toPromise();
    if (eggs.has(eggId as string)) {
      return false;
    }
    eggs.add(eggId as string);
    this._eggs$.next(eggs);
    await localforage.setItem<string[]>('eggs', Array.from(eggs));

    return true;
  }

  removeEggs() {
    localforage.removeItem('eggs');
    this._eggs$.next(new Set<string>());
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
