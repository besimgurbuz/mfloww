import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MflowwRepeatDirective } from '@mfloww/view';
import { SharedModule } from '../shared/shared.module';
import { ChangelogRoutingModule } from './changelog-routing.module';
import { ChangelogComponent } from './changelog.component';
import { ReleasesService } from './services/releases.service';

@NgModule({
  declarations: [ChangelogComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChangelogRoutingModule,
    MflowwRepeatDirective,
  ],
  providers: [ReleasesService],
})
export class ChangelogModule {}
