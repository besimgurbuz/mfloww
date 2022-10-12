import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressState {
  public inProgress: BehaviorSubject<boolean> = new BehaviorSubject(false);
}
