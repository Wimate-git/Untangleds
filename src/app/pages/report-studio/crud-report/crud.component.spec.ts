import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudreportComponent } from './crud.component';

describe('CrudComponent', () => {
  let component: CrudreportComponent;
  let fixture: ComponentFixture<CrudreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudreportComponent]
    });
    fixture = TestBed.createComponent(CrudreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
