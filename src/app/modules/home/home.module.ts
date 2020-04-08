import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {MaterialDesignModule} from '../material-design.module';
import {EggCounterComponent} from './egg-counter/egg-counter.component';
import {PictureSnapperComponent} from './picture-snapper/picture-snapper.component';


@NgModule({
  declarations: [HomeComponent, EggCounterComponent, PictureSnapperComponent],
  imports: [
    CommonModule,
    MaterialDesignModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {
}
