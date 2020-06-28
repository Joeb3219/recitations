import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecitationsComponent } from './recitations.component';

describe('RecitationsComponent', () => {
  let component: RecitationsComponent;
  let fixture: ComponentFixture<RecitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
