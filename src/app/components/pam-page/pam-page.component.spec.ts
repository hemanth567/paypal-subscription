import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PamPageComponent } from './pam-page.component';

describe('PamPageComponent', () => {
  let component: PamPageComponent;
  let fixture: ComponentFixture<PamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PamPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
