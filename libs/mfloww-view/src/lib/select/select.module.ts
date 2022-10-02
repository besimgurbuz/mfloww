import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MflowwIconComponent } from '../icon/icon.component';
import { MflowwOptionComponent } from './components/option/option.component';
import { MflowwSelectComponent } from './select.component';

@NgModule({
  declarations: [MflowwSelectComponent, MflowwOptionComponent],
  imports: [CommonModule, MflowwIconComponent],
  exports: [MflowwSelectComponent, MflowwOptionComponent],
})
export class MflowwSelectModule {}
