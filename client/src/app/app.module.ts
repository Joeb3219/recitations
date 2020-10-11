import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseSettingsComponent } from '@pages/course-settings/course-settings.component';
import { ListProblemsComponent } from '@pages/problems/list-problems/list-problems.component';
import { ViewProblemComponent } from '@pages/problems/view-problem/view-problem.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './http/token.interceptor';
import { ConfigurationsComponent } from './modules/components/configurations/configurations.component';
import { DatatableComponent } from './modules/components/datatable/datatable.component';
import { FooterComponent } from './modules/components/footer/footer.component';
import { FormModalComponent } from './modules/components/forms/form-modal/form-modal.component';
import { FormComponent } from './modules/components/forms/form/form.component';
import { ManualLoginFormComponent } from './modules/components/forms/manual-login-form/manual-login-form.component';
import { GradebookComponent } from './modules/components/gradebook/gradebook.component';
import { HeaderComponent } from './modules/components/header/header.component';
import { LearningGoalsComponent } from './modules/components/learning-goals/learning-goals.component';
import { LessonPlanDeleteComponent } from './modules/components/lesson-plans/lesson-plan-delete/lesson-plan-delete.component';
import { LessonPlanEditComponent } from './modules/components/lesson-plans/lesson-plan-edit/lesson-plan-edit.component';
import { LessonPlanStepEditComponent } from './modules/components/lesson-plans/lesson-plan-step-edit/lesson-plan-step-edit.component';
import { LessonPlanStepViewComponent } from './modules/components/lesson-plans/lesson-plan-step-view/lesson-plan-step-view.component';
import { LessonPlanStepsFormComponent } from './modules/components/lesson-plans/lesson-plan-steps/lesson-plan-steps-form/lesson-plan-steps-form.component';
import { LessonPlanViewComponent } from './modules/components/lesson-plans/lesson-plan-view/lesson-plan-view.component';
import { MeetingTimeEditComponent } from './modules/components/meeting-times/meeting-time-edit/meeting-time-edit.component';
import { MeetingTimesFormfieldComponent } from './modules/components/meeting-times/meeting-times-formfield/meeting-times-formfield.component';
import { ModalComponent } from './modules/components/modal/modal.component';
import { ProblemDeleteComponent } from './modules/components/problems/problem-delete/problem-delete.component';
import { ProblemEditComponent } from './modules/components/problems/problem-edit/problem-edit.component';
import { ProblemSearchFormComponent } from './modules/components/problems/problem-search-form/problem-search-form.component';
import { ProblemViewComponent } from './modules/components/problems/problem-view/problem-view.component';
import { QuizzesComponent } from './modules/components/quizzes/quizzes.component';
import { ReportsComponent } from './modules/components/reports/reports.component';
import { RolesComponent } from './modules/components/roles/roles.component';
import { RosterComponent } from './modules/components/roster/roster.component';
import { SectionDeleteComponent } from './modules/components/sections/section-delete/section-delete.component';
import { SectionEditComponent } from './modules/components/sections/section-edit/section-edit.component';
import { SidebarComponent } from './modules/components/sidebar/sidebar.component';
import { UserBadgeComponent } from './modules/components/users/user-badge/user-badge.component';
import { UserSearchFormfieldComponent } from './modules/components/users/user-search-formfield/user-search-formfield.component';
import { WeeksComponent } from './modules/components/weeks/weeks.component';
import { ViewCourseComponent } from './modules/pages/courses/view-course/view-course.component';
import { CoverageRequestsComponent } from './modules/pages/coverage-requests/coverage-requests.component';
import { ListLessonPlansComponent } from './modules/pages/lesson-plans/list-lesson-plans/list-lesson-plans.component';
import { ViewLessonPlanComponent } from './modules/pages/lesson-plans/view-lesson-plan/view-lesson-plan.component';
import { LoginComponent } from './modules/pages/login/login.component';
import { RecitationsComponent } from './modules/pages/recitations/recitations.component';
import { ViewSectionsComponent } from './modules/pages/sections/view-sections/view-sections.component';
import { CourseService } from './services/course.service';
import { MeetingTimeService } from './services/meetingTime.service';
import { SectionService } from './services/section.service';
import { UserService } from './services/user.service';

export let GlobalActivatedRoute: ActivatedRoute;

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
        ConfigurationsComponent,
        RolesComponent,
        GradebookComponent,
        WeeksComponent,
        LearningGoalsComponent,
        ReportsComponent,
        QuizzesComponent,
        RosterComponent,
        DatatableComponent,
        ListLessonPlansComponent,
        LessonPlanViewComponent,
        LessonPlanEditComponent,
        LessonPlanDeleteComponent,
        DatatableComponent,
        ProblemSearchFormComponent,
        LessonPlanStepsFormComponent,
        LessonPlanStepEditComponent,
        LessonPlanStepViewComponent,
        ViewLessonPlanComponent,
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
        MatFormFieldModule,
    ],
    providers: [
        UserService,
        CourseService,
        SectionService,
        MeetingTimeService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ],
    entryComponents: [
        ConfigurationsComponent,
        RolesComponent,
        GradebookComponent,
        WeeksComponent,
        LearningGoalsComponent,
        ReportsComponent,
        QuizzesComponent,
        RosterComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
