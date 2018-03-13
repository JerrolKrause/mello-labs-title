// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap
import { StoreModule } from '@ngrx/store';

// Mello Labs Tools
import { ApiToolsModule, ApiReducer, ApiStatusReducer } from '@mello-labs/api-tools';
import { FormToolsModule } from '@mello-labs/form-tools';
import { UtilitiesModule } from '@mello-labs/utilities';
import { DatagridModule } from '@mello-labs/datagrid';

// Main entrypoint component
import { AppComponent } from './app.component';
// Routing Module
import { ROUTES } from './app.routes';

// Enables faster prod mode, does disable some dirty error checking though
enableProdMode();

// Routes
import {
  NoContentComponent, LoginComponent, HomeComponent, QaComponent
} from '@routes';

// Components
import {
  FooterComponent, HeaderComponent, LayoutMainComponent, LayoutSingleComponent, NavComponent, NavSearchComponent,
  ConfirmationModalComponent, LogoutModalComponent,
  LaunchModalComponent
} from '@components';

// Shared
import {
  // App settings
  AppSettings,

  // Services
  AuthGuard,
  ServiceWorkerService,
  PostMessageService,

  // Interceptors
  HttpInterceptorService,
  GlobalErrorHandler,
  AuthService,

  // Pipes
  FilterPipe, DebouncePipe, StringPipe,

  // Directives
  FullScreenDirective
} from '@shared';


import { UIModalService, UIStoreService, UIStoreReducer } from '@ui';
import { ApiService } from '@api';
import { ViewerComponent } from './routes/home/viewer/viewer.component';
import { FormsComponent } from './routes/home/forms/forms.component';
import { BorrowerComponent } from './routes/home/forms/borrower/borrower.component';
import { VestingComponent } from './routes/home/forms/vesting/vesting.component';
import { PropertyComponent } from './routes/home/forms/property/property.component';
import { LiensComponent } from './routes/home/forms/liens/liens.component';
import { NotesComponent } from './routes/home/forms/notes/notes.component';
import { CertificationComponent } from './routes/home/forms/certification/certification.component';
import { LoanInfoComponent } from './routes/home/forms/loan-info/loan-info.component';
import { LoanComponent } from './routes/loan/loan.component';
import { EmpowerSaveComponent } from './components/modals/empower-save/empower-save.component';
import { EmpowerNotesComponent } from './components/modals/empower-notes/empower-notes.component';

// Application wide providers
export const APP_COMPONENTS = [
  NoContentComponent, LoginComponent, HomeComponent, QaComponent,

  FooterComponent, HeaderComponent, LayoutMainComponent, LayoutSingleComponent, NavComponent, NavSearchComponent,
  LaunchModalComponent,

  ConfirmationModalComponent, LogoutModalComponent
];

// Application wide providers
export const APP_PROVIDERS = [
  HttpInterceptorService,
  AuthService,
  ApiService,
  AppSettings,
  UIModalService,
  UIStoreService,
  AuthGuard,
  ServiceWorkerService,
  PostMessageService,

  // Angular Pipes
  DatePipe, CurrencyPipe,

  {// Global exception handler
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  },
];


@NgModule({
  declarations: [
    AppComponent,
    APP_COMPONENTS,

    // Pipes
    FilterPipe, DebouncePipe, StringPipe,

    // Directives
    FullScreenDirective,

    ViewerComponent,

    FormsComponent,

    BorrowerComponent,

    VestingComponent,

    PropertyComponent,

    LiensComponent,

    NotesComponent,

    CertificationComponent,

    LoanComponent,

    LoanInfoComponent,

    EmpowerSaveComponent,

    EmpowerNotesComponent,
  ],
  imports: [
    // Angular
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),

    NgbModule.forRoot(), // ng-bootstrap
    StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: UIStoreReducer }), // NGRX

    // Mello Labs
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
    UtilitiesModule.forRoot(),
    DatagridModule.forRoot()
  ],
  providers: [
    APP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationModalComponent, LogoutModalComponent, EmpowerSaveComponent, EmpowerNotesComponent
  ]
})
export class AppModule { }
