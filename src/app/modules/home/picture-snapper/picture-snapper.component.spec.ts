import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PictureSnapperComponent} from './picture-snapper.component';

describe('PictureSnapperComponent', () => {
  let component: PictureSnapperComponent;
  let fixture: ComponentFixture<PictureSnapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PictureSnapperComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureSnapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
