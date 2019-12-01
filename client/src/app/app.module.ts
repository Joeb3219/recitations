import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/components/header/header.component';
import { SidebarComponent } from './modules/components/sidebar/sidebar.component';
import { FooterComponent } from './modules/components/footer/footer.component';
import { LoginComponent } from './modules/pages/login/login.component';
import { ManualLoginFormComponent } from './modules/components/forms/manual-login-form/manual-login-form.component';
import { FormComponent } from './modules/components/forms/form/form.component';
import { ViewCourseComponent } from './modules/pages/courses/view-course/view-course.component';
import { ViewSectionsComponent } from './modules/pages/sections/view-sections/view-sections.component';

import { UserService } from './services/user.service';
import { CourseService } from './services/course.service';
import { SectionService } from './services/section.service';
import { ModalComponent } from './modules/components/modal/modal.component';
import { SectionEditComponent } from './modules/components/sections/section-edit/section-edit.component';
import { UserSearchFormfieldComponent } from './modules/components/users/user-search-formfield/user-search-formfield.component';
import { UserBadgeComponent } from './modules/components/users/user-badge/user-badge.component';
import { MeetingTimesFormfieldComponent } from './modules/components/meeting-times/meeting-times-formfield/meeting-times-formfield.component';
import { FormModalComponent } from './modules/components/forms/form-modal/form-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    ManualLoginFormComponent,
    FormComponent,
    ViewCourseComponent,
    ViewSectionsComponent,
    ModalComponent,
    SectionEditComponent,
    UserSearchFormfieldComponent,
    UserBadgeComponent,
    MeetingTimesFormfieldComponent,
    FormModalComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [
    UserService,
    CourseService,
    SectionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
