import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile1HelpRedirectionTypeComponent } from './tile1-help-redirection-type.component';

describe('Tile1HelpRedirectionTypeComponent', () => {
  let component: Tile1HelpRedirectionTypeComponent;
  let fixture: ComponentFixture<Tile1HelpRedirectionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile1HelpRedirectionTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile1HelpRedirectionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
