import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { MflowwIconComponent, MflowwRepeatDirective } from '@mfloww/view';
import { SharedModule } from '../shared/shared.module';
import { ContributorsService } from './services/contributors.service';
import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team.component';

@NgModule({
  declarations: [TeamComponent],
  imports: [
    CommonModule,
    SharedModule,
    TeamRoutingModule,
    HttpClientModule,
    MflowwRepeatDirective,
    MflowwIconComponent,
  ],
  providers: [ContributorsService],
})
export class TeamModule {}
