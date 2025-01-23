import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTableConfigComponent } from './multi-table-config.component';

describe('MultiTableConfigComponent', () => {
  let component: MultiTableConfigComponent;
  let fixture: ComponentFixture<MultiTableConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiTableConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiTableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
