import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Permission2Component } from './permission2.component';

describe('Permission2Component', () => {
  let component: Permission2Component;
  let fixture: ComponentFixture<Permission2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Permission2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Permission2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
