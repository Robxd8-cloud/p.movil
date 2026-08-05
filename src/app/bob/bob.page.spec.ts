import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BobPage } from './bob.page';

describe('BobPage', () => {
  let component: BobPage;
  let fixture: ComponentFixture<BobPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
