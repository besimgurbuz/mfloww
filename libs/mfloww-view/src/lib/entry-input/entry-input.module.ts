import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwAmountDirective } from '../amount/amount.directive';
import { MflowwIconComponent } from '../icon/icon.component';
import { MflowwSelectModule } from '../select/select.module';
import { MflowwEntryInputComponent } from './entry-input.component';

@NgModule({
  declarations: [MflowwEntryInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MflowwSelectModule,
    MflowwAmountDirective,
    MflowwIconComponent,
  ],
  exports: [MflowwEntryInputComponent],
})
export class MflowwEntryInputModule {}
