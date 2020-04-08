import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EggCounterComponent} from './egg-counter.component';

describe('EggCounterComponent', () => {
  let component: EggCounterComponent;
  let fixture: ComponentFixture<EggCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EggCounterComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EggCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
