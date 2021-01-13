import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseSettingsComponent } from '@pages/course-settings/course-settings.component';
import { ViewCourseComponent } from '@pages/courses/view-course/view-course.component';
import { ListLessonPlansComponent } from '@pages/lesson-plans/list-lesson-plans/list-lesson-plans.component';
import { LoginComponent } from '@pages/login/login.component';
import { ListProblemsComponent } from '@pages/problems/list-problems/list-problems.component';
import { ViewProblemComponent } from '@pages/problems/view-problem/view-problem.component';
import { RecitationsComponent } from '@pages/recitations/recitations.component';
import { ViewSectionsComponent } from '@pages/sections/view-sections/view-sections.component';
import { ViewUserSettingsComponent } from '@pages/user/view-user-settings/view-user-settings.component';
import { ListCoverageRequestsComponent } from './modules/pages/coverage-requests/list-coverage-requests/list-coverage-requests.component';
import { ListLearningGoalsComponent } from './modules/pages/learning-goals/list-learning-goals/list-learning-goals.component';
import { ViewLessonPlanComponent } from './modules/pages/lesson-plans/view-lesson-plan/view-lesson-plan.component';
import { CasAuthComponent } from './modules/pages/login/cas-auth/cas-auth.component';
import { ListQuizzesComponent } from './modules/pages/quizzes/list-quizzes/list-quizzes.component';
import { ViewQuizComponent } from './modules/pages/quizzes/view-quiz/view-quiz.component';
import { ListRolesComponent } from './modules/pages/roles/list-roles/list-roles.component';
import { ViewSectionComponent } from './modules/pages/sections/view-section/view-section.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cas/authenticate', component: CasAuthComponent },

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
        path: 'courses/:courseID/quizzes/:quizID',
        component: ViewQuizComponent,
    },
    {
        path: 'settings',
        component: ViewUserSettingsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
