import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { TopnavComponent } from './topnav/topnav.component';
import { HeaderComponent } from './header/header.component';
import { PageContentComponent } from './page-content/page-content.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { NgxPaginationModule } from 'ngx-pagination';

import { FooterComponent } from './footer/footer.component';

import { RegisterComponent } from './register/register.component';
import { NavbarMainComponent } from './navbar-main/navbar-main.component';
import { TableComponent } from './table/table.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'register', component: RegisterComponent },
      {
        path: 'table',
        component: TableComponent,
      },
    ],
  },

  {
    path: '**',
    component: LoginComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    ScrollbarComponent,
    TopnavComponent,
    HeaderComponent,
    PageContentComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    NavbarMainComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgxPaginationModule,
    RouterModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    FormsModule,
    NoopAnimationsModule,
    MatSortModule,
  ],
  providers: [
    {
      provide: AuthService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
