import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'; // Import withFetch
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AuthorizationInterceptor } from './Services/interceptor/authorization-interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideToastr(),
    provideAnimationsAsync(),
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    provideHttpClient(withInterceptors([AuthorizationInterceptor])),
    provideCharts(withDefaultRegisterables()),
  ],
};
