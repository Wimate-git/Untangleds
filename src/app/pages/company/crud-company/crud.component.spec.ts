import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudcompanyComponent } from './crud.component';

describe('CrudComponent', () => {
  let component: CrudcompanyComponent;
  let fixture: ComponentFixture<CrudcompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudcompanyComponent]
    });
    fixture = TestBed.createComponent(CrudcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
