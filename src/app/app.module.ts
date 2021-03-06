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
import { NoContentComponent, LoginComponent, HomeComponent, QaComponent, ViewerRouteComponent } from '@routes';

// Components
import {
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  ConfirmationModalComponent,
  LogoutModalComponent,
  ExceptionComponent,
  LaunchModalComponent,
  DocumentViewerComponent,
} from '@components';

// Shared
import {
  // App settings
  AppSettings,

  // Services
  AuthGuard,
  ServiceWorkerService,
  PostMessageService,
  AppCommsService,

  // Interceptors
  HttpInterceptorService,
  GlobalErrorHandler,
  AuthService,

  // Pipes
  FilterPipe,
  DebouncePipe,
  StringPipe,

  // Directives
  FullScreenDirective,
} from '@shared';

import { UIModalService, UIStoreService, UIStoreReducer } from '@ui';
import { ApiService } from '@api';
import { LoanInfoComponent } from './components/loan-info/loan-info.component';
import { LoanComponent } from './routes/loan/loan.component';
import { EmpowerSaveComponent } from './components/modals/empower-save/empower-save.component';
import { EmpowerNotesComponent } from './components/modals/empower-notes/empower-notes.component';
import { FormRowComponent } from './components/form-title/form-row/form-row.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { WebToolComponent } from './components/web-tool/web-tool.component';
import { DocumentStatusComponent } from './components/document-status/document-status.component';
import { SortPipe } from './shared/pipes/sort.pipe';
import { LoanContactsComponent } from './components/loan-contacts/loan-contacts.component';
import { FormTitleComponent } from './components/form-title/form-title.component';
import { ConditionsComponent } from './components/modals/conditions/conditions.component';

// Application wide providers
export const APP_COMPONENTS = [
  NoContentComponent,
  LoginComponent,
  HomeComponent,
  QaComponent,
  ViewerRouteComponent,

  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  LaunchModalComponent,

  ConfirmationModalComponent,
  LogoutModalComponent,
  ExceptionComponent,
];

// Application wide providers
export const APP_PROVIDERS = [
  HttpInterceptorService,
  AuthService,
  ApiService,
  AppSettings,
  AppCommsService,
  UIModalService,
  UIStoreService,
  AuthGuard,
  ServiceWorkerService,
  PostMessageService,

  // Angular Pipes
  DatePipe,
  CurrencyPipe,

  {
    // Global exception handler
    provide: ErrorHandler,
    useClass: GlobalErrorHandler,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    APP_COMPONENTS,

    // Pipes
    FilterPipe,
    DebouncePipe,
    StringPipe,

    // Directives
    FullScreenDirective,

    DocumentViewerComponent,

    LoanComponent,

    LoanInfoComponent,

    EmpowerSaveComponent,

    EmpowerNotesComponent,

    FormRowComponent,

    ViewerComponent,

    ViewerRouteComponent,

    WebToolComponent,

    DocumentStatusComponent,

    SortPipe,

    LoanContactsComponent,

    FormTitleComponent,

    ConditionsComponent,
  ],
  imports: [
    // Angular
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),

    NgbModule.forRoot(), // ng-bootstrap
    StoreModule.forRoot({ api: ApiReducer, apiStatus: ApiStatusReducer, ui: UIStoreReducer }), // NGRX

    // Mello Labs
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
    UtilitiesModule.forRoot(),
    DatagridModule.forRoot(),
  ],
  providers: [
    APP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationModalComponent,
    LogoutModalComponent,
    ExceptionComponent,
    EmpowerSaveComponent,
    EmpowerNotesComponent,
    ConditionsComponent
  ],
})
export class AppModule {}
