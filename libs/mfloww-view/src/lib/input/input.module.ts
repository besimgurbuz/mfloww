import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwCopyClipboardDirective } from '../copy-clipboard/copy-clipboard.directive';
import { MflowwInputComponent } from './input.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MflowwCopyClipboardDirective],
  declarations: [MflowwInputComponent],
  exports: [MflowwInputComponent],
})
export class MflowwInputModule {}
