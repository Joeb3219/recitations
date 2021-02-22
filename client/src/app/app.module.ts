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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ViewTaFeedbackComponent } from '@components/reports/view-ta-feedback/view-ta-feedback.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseSettingsComponent } from '@pages/course-settings/course-settings.component';
import { ListProblemsComponent } from '@pages/problems/list-problems/list-problems.component';
import { ViewProblemComponent } from '@pages/problems/view-problem/view-problem.component';
import { MeetingService } from '@services/meeting.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FileUploadModule } from 'ng2-file-upload';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AbilitiesDirective } from './directives/abilities.directive';
import { TokenInterceptor } from './http/token.interceptor';
import { CalendarComponent } from './modules/components/calendar/calendar.component';
import { ConfigurationsComponent } from './modules/components/configurations/configurations.component';
import { CoverageRequestEditComponent } from './modules/components/coverage-requests/coverage-request-edit/coverage-request-edit.component';
import { DatatableComponent } from './modules/components/datatable/datatable.component';
import { FooterComponent } from './modules/components/footer/footer.component';
import { FileUploaderComponent } from './modules/components/forms/file-uploader/file-uploader.component';
import { FormModalComponent } from './modules/components/forms/form-modal/form-modal.component';
import { FormInputsComponent } from './modules/components/forms/form/form-inputs/form-inputs.component';
import { FormComponent } from './modules/components/forms/form/form.component';
import { ManualLoginFormComponent } from './modules/components/forms/manual-login-form/manual-login-form.component';
import { GradebookComponent } from './modules/components/gradebook/gradebook.component';
import { HeaderComponent } from './modules/components/header/header.component';
import { HomeComponent } from './modules/components/home/home/home.component';
import { LearningGoalSearchFormfieldComponent } from './modules/components/learning-goals/learning-goal-search-formfield/learning-goal-search-formfield.component';
import { LearningGoalsComponent } from './modules/components/learning-goals/learning-goals.component';
import { LessonPlanDeleteComponent } from './modules/components/lesson-plans/lesson-plan-delete/lesson-plan-delete.component';
import { LessonPlanEditComponent } from './modules/components/lesson-plans/lesson-plan-edit/lesson-plan-edit.component';
import { LessonPlanFormfieldComponent } from './modules/components/lesson-plans/lesson-plan-formfield/lesson-plan-formfield.component';
import { LessonPlanStepEditComponent } from './modules/components/lesson-plans/lesson-plan-step-edit/lesson-plan-step-edit.component';
import { LessonPlanStepViewComponent } from './modules/components/lesson-plans/lesson-plan-step-view/lesson-plan-step-view.component';
import { LessonPlanStepsFormComponent } from './modules/components/lesson-plans/lesson-plan-steps/lesson-plan-steps-form/lesson-plan-steps-form.component';
import { LessonPlanViewComponent } from './modules/components/lesson-plans/lesson-plan-view/lesson-plan-view.component';
import { LessonEditComponent } from './modules/components/lessons/lesson-edit/lesson-edit.component';
import { MeetingTimeEditComponent } from './modules/components/meeting-times/meeting-time-edit/meeting-time-edit.component';
import { MeetingTimesFormfieldComponent } from './modules/components/meeting-times/meeting-times-formfield/meeting-times-formfield.component';
import { MeetingFeedbackEditComponent } from './modules/components/meetings/meeting-feedback-edit/meeting-feedback-edit.component';
import { ModalComponent } from './modules/components/modal/modal.component';
import { ProblemDeleteComponent } from './modules/components/problems/problem-delete/problem-delete.component';
import { ProblemEditComponent } from './modules/components/problems/problem-edit/problem-edit.component';
import { ProblemSearchFormComponent } from './modules/components/problems/problem-search-form/problem-search-form.component';
import { ProblemViewComponent } from './modules/components/problems/problem-view/problem-view.component';
import { MultipleChoiceComponent } from './modules/components/quizzes/formfields/multiple-choice/multiple-choice/multiple-choice.component';
import { QuizBuilderComponent } from './modules/components/quizzes/quiz-builder/quiz-builder/quiz-builder.component';
import { QuizEditComponent } from './modules/components/quizzes/quiz-edit/quiz-edit.component';
import { QuizSearchFormfieldComponent } from './modules/components/quizzes/quiz-search-formfield/quiz-search-formfield.component';
import { QuizTakeComponent } from './modules/components/quizzes/quiz-take/quiz-take/quiz-take.component';
import { QuizViewFreeResponseComponent } from './modules/components/quizzes/quiz-view/quiz-view-free-response/quiz-view-free-response.component';
import { QuizViewMultipleChoiceComponent } from './modules/components/quizzes/quiz-view/quiz-view-multiple-choice/quiz-view-multiple-choice.component';
import { QuizViewComponent } from './modules/components/quizzes/quiz-view/quiz-view.component';
import { QuizzesComponent } from './modules/components/quizzes/quizzes.component';
import { ViewStudentFeedbackComponent } from './modules/components/reports/view-student-feedback/view-student-feedback.component';
import { RoleAssignComponent } from './modules/components/roles/role-assign/role-assign.component';
import { RoleDeleteComponent } from './modules/components/roles/role-delete/role-delete.component';
import { RoleEditComponent } from './modules/components/roles/role-edit/role-edit.component';
import { RolesFormfieldComponent } from './modules/components/roles/roles-formfield/roles-formfield.component';
import { EditRosterComponent } from './modules/components/roster/edit-roster/edit-roster.component';
import { RosterFormfieldComponent } from './modules/components/roster/roster-formfield/roster-formfield.component';
import { ViewRosterComponent } from './modules/components/roster/view-roster/view-roster.component';
import { SectionDeleteComponent } from './modules/components/sections/section-delete/section-delete.component';
import { SectionEditComponent } from './modules/components/sections/section-edit/section-edit.component';
import { SectionViewComponent } from './modules/components/sections/section-view/section-view.component';
import { SectionsSyncComponent } from './modules/components/sections/sections-sync/sections-sync.component';
import { SectionsTaSyncComponent } from './modules/components/sections/sections-ta-sync/sections-ta-sync/sections-ta-sync.component';
import { SidebarComponent } from './modules/components/sidebar/sidebar.component';
import { TodosViewComponent } from './modules/components/todos/todos-view/todos-view.component';
import { UserBadgeComponent } from './modules/components/users/user-badge/user-badge.component';
import { UserCreateComponent } from './modules/components/users/user-create/user-create.component';
import { UserSearchFormfieldComponent } from './modules/components/users/user-search-formfield/user-search-formfield.component';
import { UsersMultiFormfieldComponent } from './modules/components/users/users-multi-formfield/users-multi-formfield.component';
import { WeeksComponent } from './modules/components/weeks/weeks.component';
import { ViewCourseComponent } from './modules/pages/courses/view-course/view-course.component';
import { ListCoverageRequestsComponent } from './modules/pages/coverage-requests/list-coverage-requests/list-coverage-requests.component';
import { MonitorCoverageRequestsComponent } from './modules/pages/coverage-requests/monitor-coverge-requests/monitor-coverage-requests/monitor-coverage-requests.component';
import { ListLearningGoalsComponent } from './modules/pages/learning-goals/list-learning-goals/list-learning-goals.component';
import { ListLessonPlansComponent } from './modules/pages/lesson-plans/list-lesson-plans/list-lesson-plans.component';
import { ViewLessonPlanComponent } from './modules/pages/lesson-plans/view-lesson-plan/view-lesson-plan.component';
import { CasAuthComponent } from './modules/pages/login/cas-auth/cas-auth.component';
import { LoginComponent } from './modules/pages/login/login.component';
import { ViewMeetingFeedbackComponent } from './modules/pages/meetings/view-meeting-feedback/view-meeting-feedback.component';
import { ListQuizzesComponent } from './modules/pages/quizzes/list-quizzes/list-quizzes.component';
import { TakeQuizComponent } from './modules/pages/quizzes/take-quiz/take-quiz.component';
import { ViewQuizComponent } from './modules/pages/quizzes/view-quiz/view-quiz.component';
import { RecitationsComponent } from './modules/pages/recitations/recitations.component';
import { ViewReportsComponent } from './modules/pages/reports/view-reports/view-reports.component';
import { ListRolesComponent } from './modules/pages/roles/list-roles/list-roles.component';
import { ViewSectionComponent } from './modules/pages/sections/view-section/view-section.component';
import { ViewSectionsComponent } from './modules/pages/sections/view-sections/view-sections.component';
import { ViewUserSettingsComponent } from './modules/pages/user/view-user-settings/view-user-settings.component';
import { CourseService } from './services/course.service';
import { LearningGoalService } from './services/learningGoal.service';
import { MeetingTimeService } from './services/meetingTime.service';
import { SectionService } from './services/section.service';
import { UserService } from './services/user.service';
import { ViewGradebookComponent } from './modules/pages/gradebook/view-gradebook/view-gradebook.component';
import { ListGradebookOverridesComponent } from './modules/pages/gradebook-overrides/list-gradebook-overrides/list-gradebook-overrides.component';
import { GradebookOverrideEditComponent } from './modules/components/gradebook-override/gradebook-override-edit/gradebook-override-edit.component';
import { GradebookOverrideEditDateRangeComponent } from './modules/components/gradebook-override/gradebook-override-edit-date-range/gradebook-override-edit-date-range.component';
import { GradebookOverrideEditUserComponent } from './modules/components/gradebook-override/gradebook-override-edit-user/gradebook-override-edit-user.component';
import { GradebookOverrideEditMeetingTimeComponent } from './modules/components/gradebook-override/gradebook-override-edit-meeting-time/gradebook-override-edit-meeting-time.component';
import { GradebookOverrideOverridesFormfieldComponent } from './modules/components/gradebook-override/gradebook-override-overrides-formfield/gradebook-override-overrides-formfield.component';
import { ViewSectionReportComponent } from './modules/pages/reports/view-section-report/view-section-report.component';
import { ReportsSectionViewComponent } from './modules/components/reports/reports-section-view/reports-section-view.component';

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
        RecitationsComponent,
        ConfigurationsComponent,
        GradebookComponent,
        WeeksComponent,
        LearningGoalsComponent,
        QuizzesComponent,
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
        CalendarComponent,
        ListLearningGoalsComponent,
        FormInputsComponent,
        LearningGoalSearchFormfieldComponent,
        QuizBuilderComponent,
        QuizViewComponent,
        MultipleChoiceComponent,
        ListQuizzesComponent,
        QuizEditComponent,
        ViewQuizComponent,
        QuizViewMultipleChoiceComponent,
        QuizViewFreeResponseComponent,
        EditRosterComponent,
        ViewRosterComponent,
        FileUploaderComponent,
        ViewUserSettingsComponent,
        SectionsSyncComponent,
        ListRolesComponent,
        RoleEditComponent,
        RoleDeleteComponent,
        RoleAssignComponent,
        RolesFormfieldComponent,
        AbilitiesDirective,
        UsersMultiFormfieldComponent,
        UserCreateComponent,
        ListCoverageRequestsComponent,
        CoverageRequestEditComponent,
        ViewSectionComponent,
        SectionViewComponent,
        LessonEditComponent,
        LessonPlanFormfieldComponent,
        QuizSearchFormfieldComponent,
        CasAuthComponent,
        ViewMeetingFeedbackComponent,
        MeetingFeedbackEditComponent,
        RosterFormfieldComponent,
        HomeComponent,
        TakeQuizComponent,
        QuizTakeComponent,
        SectionsTaSyncComponent,
        TodosViewComponent,
        MonitorCoverageRequestsComponent,
        ViewReportsComponent,
        ViewTaFeedbackComponent,
        ViewStudentFeedbackComponent,
        ViewGradebookComponent,
        ListGradebookOverridesComponent,
        GradebookOverrideEditComponent,
        GradebookOverrideEditDateRangeComponent,
        GradebookOverrideEditUserComponent,
        GradebookOverrideEditMeetingTimeComponent,
        GradebookOverrideOverridesFormfieldComponent,
        ViewSectionReportComponent,
        ReportsSectionViewComponent,
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
        CKEditorModule,
        QuillModule.forRoot(),
        MatExpansionModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        // ModalModule.forRoot(),
        MatTabsModule,
        NgxDatatableModule,
        MatFormFieldModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        FileUploadModule,
    ],
    providers: [
        UserService,
        CourseService,
        MeetingService,
        SectionService,
        MeetingTimeService,
        LearningGoalService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ],
    entryComponents: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
