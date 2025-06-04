import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile1HelpPrimaryValueComponent } from './tile1-help-primary-value.component';

describe('Tile1HelpPrimaryValueComponent', () => {
  let component: Tile1HelpPrimaryValueComponent;
  let fixture: ComponentFixture<Tile1HelpPrimaryValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile1HelpPrimaryValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile1HelpPrimaryValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
