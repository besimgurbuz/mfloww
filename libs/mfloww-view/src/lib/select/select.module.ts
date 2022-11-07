import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MflowwIconComponent } from '../icon/icon.component';
import { MflowwSelectOptionDirective } from './directives/select-option.directive';
import { MflowwSelectComponent } from './select.component';

@NgModule({
  declarations: [MflowwSelectComponent, MflowwSelectOptionDirective],
  imports: [CommonModule, MflowwIconComponent, ReactiveFormsModule],
  exports: [MflowwSelectComponent, MflowwSelectOptionDirective],
})
export class MflowwSelectModule {}
