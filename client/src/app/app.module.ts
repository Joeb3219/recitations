import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/components/header/header.component';
import { SidebarComponent } from './modules/components/sidebar/sidebar.component';
import { FooterComponent } from './modules/components/footer/footer.component';
import { LoginComponent } from './modules/pages/login/login.component';
import { ManualLoginFormComponent } from './modules/components/forms/manual-login-form/manual-login-form.component';
import { FormComponent } from './modules/components/forms/form/form.component';

import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    ManualLoginFormComponent,
    FormComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
