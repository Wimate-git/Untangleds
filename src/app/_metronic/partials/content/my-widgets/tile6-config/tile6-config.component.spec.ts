import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile6ConfigComponent } from './tile6-config.component';

describe('Tile6ConfigComponent', () => {
  let component: Tile6ConfigComponent;
  let fixture: ComponentFixture<Tile6ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile6ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile6ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
