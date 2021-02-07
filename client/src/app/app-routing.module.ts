import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home/home.component';
import { CourseSettingsComponent } from '@pages/course-settings/course-settings.component';
import { ViewCourseComponent } from '@pages/courses/view-course/view-course.component';
import { ListLessonPlansComponent } from '@pages/lesson-plans/list-lesson-plans/list-lesson-plans.component';
import { LoginComponent } from '@pages/login/login.component';
import { ViewMeetingFeedbackComponent } from '@pages/meetings/view-meeting-feedback/view-meeting-feedback.component';
import { ListProblemsComponent } from '@pages/problems/list-problems/list-problems.component';
import { ViewProblemComponent } from '@pages/problems/view-problem/view-problem.component';
import { RecitationsComponent } from '@pages/recitations/recitations.component';
import { ViewSectionsComponent } from '@pages/sections/view-sections/view-sections.component';
import { ViewUserSettingsComponent } from '@pages/user/view-user-settings/view-user-settings.component';
import { ListCoverageRequestsComponent } from './modules/pages/coverage-requests/list-coverage-requests/list-coverage-requests.component';
import { MonitorCoverageRequestsComponent } from './modules/pages/coverage-requests/monitor-coverge-requests/monitor-coverage-requests/monitor-coverage-requests.component';
import { ListGradebookOverridesComponent } from './modules/pages/gradebook-overrides/list-gradebook-overrides/list-gradebook-overrides.component';
import { ViewGradebookComponent } from './modules/pages/gradebook/view-gradebook/view-gradebook.component';
import { ListLearningGoalsComponent } from './modules/pages/learning-goals/list-learning-goals/list-learning-goals.component';
import { ViewLessonPlanComponent } from './modules/pages/lesson-plans/view-lesson-plan/view-lesson-plan.component';
import { CasAuthComponent } from './modules/pages/login/cas-auth/cas-auth.component';
import { ListQuizzesComponent } from './modules/pages/quizzes/list-quizzes/list-quizzes.component';
import { TakeQuizComponent } from './modules/pages/quizzes/take-quiz/take-quiz.component';
import { ViewQuizComponent } from './modules/pages/quizzes/view-quiz/view-quiz.component';
import { ViewReportsComponent } from './modules/pages/reports/view-reports/view-reports.component';
import { ListRolesComponent } from './modules/pages/roles/list-roles/list-roles.component';
import { ViewSectionComponent } from './modules/pages/sections/view-section/view-section.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cas/ticket', component: CasAuthComponent },

    { path: 'courses/:courseID', component: ViewCourseComponent },
    { path: 'courses/:courseID/sections', component: ViewSectionsComponent },
    { path: 'courses/:courseID/sections/:sectionID', component: ViewSectionComponent },
    { path: 'courses/:courseID/problems', component: ListProblemsComponent },
    {
        path: 'courses/:courseID/problems/:problemID',
        component: ViewProblemComponent,
    },
    { path: 'courses/:courseID/settings', component: CourseSettingsComponent },
    { path: 'courses/:courseID/roles', component: ListRolesComponent },
    {
        path: 'courses/:courseID/coverage-requests',
        component: ListCoverageRequestsComponent,
    },
    {
        path: 'courses/:courseID/coverage-requests/monitor',
        component: MonitorCoverageRequestsComponent,
    },
    { path: 'courses/:courseID/recitations', component: RecitationsComponent },
    {
        path: 'courses/:courseID/lesson-plans',
        component: ListLessonPlansComponent,
    },
    {
        path: 'courses/:courseID/lesson-plans/:lessonPlanID',
        component: ViewLessonPlanComponent,
    },
    {
        path: 'courses/:courseID/learning-goals',
        component: ListLearningGoalsComponent,
    },
    {
        path: 'courses/:courseID/quizzes',
        component: ListQuizzesComponent,
    },
    {
        path: 'courses/:courseID/reports',
        component: ViewReportsComponent,
    },
    {
        path: 'courses/:courseID/my-gradebook',
        component: ViewGradebookComponent,
    },
    {
        path: 'courses/:courseID/gradebook-overrides',
        component: ListGradebookOverridesComponent,
    },
    {
        path: 'courses/:courseID/quizzes/:quizID',
        component: ViewQuizComponent,
    },
    {
        path: 'settings',
        component: ViewUserSettingsComponent,
    },
    {
        path: `courses/:courseID/meeting-feedback/:date`,
        component: ViewMeetingFeedbackComponent,
    },
    {
        path: `courses/:courseID/quiz/:date`,
        component: TakeQuizComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
