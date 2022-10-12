import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgressState } from './core/progress.state';

@Component({
  selector: 'mfloww-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private progressState: ProgressState) {}

  get inProgress$(): Observable<boolean> {
    return this.progressState.inProgress.asObservable();
  }
}
