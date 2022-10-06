import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwAmountDirective } from '../amount/amount.directive';
import { MflowwSelectModule } from '../select/select.module';
import { MflowwEntryInputComponent } from './entry-input.component';

@NgModule({
  declarations: [MflowwEntryInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MflowwSelectModule,
    MflowwAmountDirective,
  ],
  exports: [MflowwEntryInputComponent],
})
export class MflowwEntryInputModule {}
