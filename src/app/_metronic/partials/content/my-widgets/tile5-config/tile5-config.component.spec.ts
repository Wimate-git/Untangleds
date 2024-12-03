import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile5ConfigComponent } from './tile5-config.component';

describe('Tile5ConfigComponent', () => {
  let component: Tile5ConfigComponent;
  let fixture: ComponentFixture<Tile5ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile5ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile5ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
