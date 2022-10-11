import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwInputComponent } from './input.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [MflowwInputComponent],
  exports: [MflowwInputComponent],
})
export class MflowwInputModule {}
