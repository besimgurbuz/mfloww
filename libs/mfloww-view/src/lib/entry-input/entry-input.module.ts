import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwIconComponent } from '../icon/icon.component';
import { MflowwSelectModule } from '../select/select.module';
import { MflowwEntryInputComponent } from './entry-input.component';

@NgModule({
  declarations: [MflowwEntryInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MflowwSelectModule,
    MflowwIconComponent,
  ],
  exports: [MflowwEntryInputComponent],
})
export class MflowwEntryInputModule {}
