import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwInputModule } from '@mfloww/view';

import { SharedModule } from '../shared/shared.module';
import { LogInComponent } from './log-in/log-in.component';
import { UserService } from './services/user.service';
import { SettingsComponent } from './settings/settings.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [LogInComponent, SignUpComponent, SettingsComponent],
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
