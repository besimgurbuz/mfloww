import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwIconComponent } from '../icon/icon.component';
import { MflowwOptionComponent } from './components/option/option.component';
import { MflowwSelectComponent } from './select.component';

@NgModule({
  declarations: [MflowwSelectComponent, MflowwOptionComponent],
  imports: [CommonModule, MflowwIconComponent, ReactiveFormsModule],
  exports: [MflowwSelectComponent, MflowwOptionComponent],
})
export class MflowwSelectModule {}
