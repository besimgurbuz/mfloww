import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [LogInComponent, SignUpComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
