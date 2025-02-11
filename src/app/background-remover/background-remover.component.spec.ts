import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundRemoverComponent } from './background-remover.component';

describe('BackgroundRemoverComponent', () => {
  let component: BackgroundRemoverComponent;
  let fixture: ComponentFixture<BackgroundRemoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackgroundRemoverComponent]
    });
    fixture = TestBed.createComponent(BackgroundRemoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
