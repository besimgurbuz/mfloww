import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwInputModule } from '@mfloww/view';

import { SharedModule } from '../shared/shared.module';
import { PlatformButtonComponent } from './platform-button/platform-button.component';
import { UserService } from './services/user.service';
import { SettingsComponent } from './settings/settings.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
    PlatformButtonComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MflowwInputModule,
  ],
  providers: [UserService],
})
export class UserModule {}
