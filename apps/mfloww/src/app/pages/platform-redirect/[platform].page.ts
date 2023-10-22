import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportedPlatform } from '@mfloww/common';
import { User } from '@prisma/client';
import { AuthService } from '../../core/auth.service';
import { ProfileInfo } from '../../core/models/profile-info';
import { SnackBarService } from '../../core/snack-bar.service';

@Component({
  standalone: true,
  imports: [NgIf, HttpClientModule],
  template: `
    <div class="flex items-center justify-center h-full min-h-[600px]">
      <div class="flex flex-col items-center gap-2">
        <h2 *ngIf="!error(); else errorMessage">
          You'll be redirected if everything is correct, hold on tight!
        </h2>
        <h3 *ngIf="inProgress()" class="text-sm">
          Signing in with {{ platform }}...
        </h3>
        <ng-template #errorMessage>
          <p class="text-sm">Failed to sign in with {{ platform }}</p>
        </ng-template>
      </div>
    </div>
  `,
})
export default class PlatformRedirectComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBarService = inject(SnackBarService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private queryParamMap = inject(ActivatedRoute).snapshot.queryParamMap;

  @Input() platform!: SupportedPlatform;

  inProgress = signal(false);
  error = signal<Error | null>(null);

  ngOnInit(): void {
    this.inProgress.set(true);
    const requestBody: Record<string, string> = {};
    if (this.platform.toUpperCase() === SupportedPlatform.GOOGLE) {
      const userCode = this.queryParamMap.get('code');

      if (!userCode) {
        this.snackBarService.emitMessage({
          type: 'fatal',
          text: 'Errors.PlatformLoginInvalidRequest',
        });
        this.inProgress.set(false);
        return;
      }
      requestBody['code'] = userCode;
    }

    this.http
      .post<User>(`/api/v1/platform-auth/${this.platform}`, requestBody)
      .subscribe({
        next: (user) => {
          this.inProgress.set(false);
          this.authService.setProfileInfo(user as ProfileInfo);
          this.router.navigate(['/dashboard/balance']);
        },
        error: (err) => {
          this.inProgress.set(false);
          this.error.set(err);
        },
      });
  }
}
