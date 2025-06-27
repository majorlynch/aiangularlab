import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppCommonModule } from './app.common.module';
import { routes } from './app.routes';



export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(AppCommonModule),
    provideHttpClient(),
    provideRouter(routes)
  ],
};
