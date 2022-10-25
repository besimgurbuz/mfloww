import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from './core/auth.service';
import { MessengerService } from './core/messenger.service';
import { ProfileInfo } from './core/models/profile-info';
import { ProgressState } from './core/progress.state';

@Component({
  selector: 'mfloww-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  readonly errorMessenger = inject(MessengerService);
  readonly inProgress$ = inject(ProgressState).inProgress$;
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);
  readonly _profileInfo$: Observable<ProfileInfo | null> =
    this.authService.profileInfo$;

  errorMessage$ = this.errorMessenger.error$;
  private _destroy: Subject<void> = new Subject();

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((paramMap) => this.errorMessenger.getActiveMessage(paramMap)),
        takeUntil(this._destroy)
      )
      .subscribe((reason) => {
        if (reason) {
          this.errorMessenger.emitMessage(reason.type, reason.message);
        } else {
          this.errorMessenger.clearMessage();
        }
      });

    if (this.authService.isUserLoggedIn()) {
      this.authService
        .getProfileInfo()
        .pipe(takeUntil(this._destroy))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  handleLogOut() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }
}
