import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchFormfieldComponent } from './user-search-formfield.component';

describe('UserSearchFormfieldComponent', () => {
  let component: UserSearchFormfieldComponent;
  let fixture: ComponentFixture<UserSearchFormfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSearchFormfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchFormfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
