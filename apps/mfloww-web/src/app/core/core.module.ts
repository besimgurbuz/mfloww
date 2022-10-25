import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  providers: [],
  imports: [RouterModule],
  exports: [HttpClientModule, NotFoundComponent],
  declarations: [NotFoundComponent],
})
export class CoreModule {}
