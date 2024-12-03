import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile1ConfigComponent } from './tile1-config.component';

describe('Tile1ConfigComponent', () => {
  let component: Tile1ConfigComponent;
  let fixture: ComponentFixture<Tile1ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile1ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile1ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
