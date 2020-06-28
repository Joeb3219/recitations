import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageRequestsComponent } from './coverage-requests.component';

describe('CoverageRequestsComponent', () => {
  let component: CoverageRequestsComponent;
  let fixture: ComponentFixture<CoverageRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverageRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
