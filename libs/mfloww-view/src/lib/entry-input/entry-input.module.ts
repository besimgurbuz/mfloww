import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwSelectModule } from '../select/select.module';
import { MflowwEntryInputComponent } from './entry-input.component';

@NgModule({
  declarations: [MflowwEntryInputComponent],
  imports: [CommonModule, ReactiveFormsModule, MflowwSelectModule],
  exports: [MflowwEntryInputComponent],
})
export class MflowwEntryInputModule {}
