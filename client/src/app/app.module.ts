import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { QuillModule } from 'ngx-quill'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

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
import { ModalComponent } from './modules/components/modal/modal.component';
import { SectionEditComponent } from './modules/components/sections/section-edit/section-edit.component';
import { UserSearchFormfieldComponent } from './modules/components/users/user-search-formfield/user-search-formfield.component';
import { UserBadgeComponent } from './modules/components/users/user-badge/user-badge.component';
import { MeetingTimesFormfieldComponent } from './modules/components/meeting-times/meeting-times-formfield/meeting-times-formfield.component';
import { FormModalComponent } from './modules/components/forms/form-modal/form-modal.component';
import { MeetingTimeEditComponent } from './modules/components/meeting-times/meeting-time-edit/meeting-time-edit.component';
import { ProblemEditComponent } from './modules/components/problems/problem-edit/problem-edit.component';

import { UserService } from './services/user.service';
import { CourseService } from './services/course.service';
import { SectionService } from './services/section.service';
import { MeetingTimeService } from './services/meetingTime.service';
import { ListProblemsComponent } from '@pages/problems/list-problems/list-problems.component';
import { ViewProblemComponent } from '@pages/problems/view-problem/view-problem.component';
import { ProblemViewComponent } from './modules/components/problems/problem-view/problem-view.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProblemDeleteComponent } from './modules/components/problems/problem-delete/problem-delete.component';
import { SectionDeleteComponent } from './modules/components/sections/section-delete/section-delete.component';
import { CourseSettingsComponent } from '@pages/course-settings/course-settings.component';
import {MatTabsModule} from "@angular/material/tabs";
import { CoverageRequestsComponent } from './modules/pages/coverage-requests/coverage-requests.component';
import { RecitationsComponent } from './modules/pages/recitations/recitations.component';
import { TokenInterceptor } from './http/token.interceptor';
import { DatatableComponent } from './modules/components/datatable/datatable.component';


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
    FormModalComponent,
    MeetingTimeEditComponent,
    ProblemEditComponent,
    ListProblemsComponent,
    ViewProblemComponent,
    ProblemViewComponent,
    ProblemDeleteComponent,
    SectionDeleteComponent,
    CourseSettingsComponent,
    CoverageRequestsComponent,
    RecitationsComponent,
    DatatableComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    ModalModule.forRoot(),
    MatTabsModule,
    NgxDatatableModule,
  ],
  providers: [
    UserService,
    CourseService,
    SectionService,
    MeetingTimeService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
