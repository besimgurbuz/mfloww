import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MflowwRepeatDirective } from '@mfloww/view';
import { SharedModule } from '../shared/shared.module';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    SharedModule,
    FaqRoutingModule,
    MflowwRepeatDirective,
  ],
})
export class FaqModule {}
