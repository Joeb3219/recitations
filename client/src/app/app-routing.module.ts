import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '@pages/login/login.component'
import { ViewCourseComponent } from '@pages/courses/view-course/view-course.component'
import { ViewSectionsComponent } from '@pages/sections/view-sections/view-sections.component'
import { ViewProblemsComponent } from '@pages/problems/view-problems/view-problems.component'

const routes: Routes = [

	{ path: 'login', component: LoginComponent },

	{ path: 'courses/:courseID', component: ViewCourseComponent },
	{ path: 'courses/:courseID/sections', component: ViewSectionsComponent },
	{ path: 'courses/:courseID/problems', component: ViewProblemsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
