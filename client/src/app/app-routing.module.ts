import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '@pages/login/login.component'
import { ViewCourseComponent } from '@pages/courses/view-course/view-course.component'

const routes: Routes = [

	{ path: 'login', component: LoginComponent },

	{ path: 'courses/:courseID', component: ViewCourseComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
