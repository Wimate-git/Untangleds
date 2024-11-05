import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudSummaryComponent } from './crud-summary.component';

describe('CrudSummaryComponent', () => {
  let component: CrudSummaryComponent;
  let fixture: ComponentFixture<CrudSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
