import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MflowwDbInitializerService } from './services/db-initializer/db-initializer.service';

@NgModule({
  imports: [CommonModule],
  providers: [MflowwDbInitializerService],
})
export class MflowwDbModule {}
