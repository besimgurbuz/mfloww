import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Icon, MflowwIconComponent, MflowwRepeatDirective } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { ContributorsService } from './contributors.service';

export const routeMeta: RouteMeta = {
  title: () => `${inject(TranslocoService).translate('Common.Team')} | mfloww`,
};

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    MflowwIconComponent,
    MflowwRepeatDirective,
    AsyncPipe,
    TranslocoDirective,
  ],
  providers: [ContributorsService],
  template: `
    <section
      *transloco="let t"
      class="lg:px-[300px] md:px-[150px] px-10 pt-20 pb-44 flex flex-col gap-10"
    >
      <div>
        <h2 class="text-xl">{{ t('Team.Title') }}</h2>
        <div class="flex mt-5 justify-between">
          <div *ngFor="let member of members" class="flex flex-col gap-1 w-40">
            <img
              [ngSrc]="member.photoUrl"
              [alt]="member.fullname"
              width="150"
              height="150"
              class="rounded bg-transparent"
              priority
            />
            <h4>{{ member.fullname }}</h4>
            <p class="text-[10px] text-gray-500">
              {{ t(member.title) }}
            </p>
            <div class="flex w-full gap-2">
              <a
                *ngFor="let socialMedia of member.links"
                target="_blank"
                class="w-5"
                rel="noreferrer"
                [href]="socialMedia.href"
                ><mfloww-view-icon [type]="socialMedia.icon"></mfloww-view-icon
              ></a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 class="text-xl">{{ t('Team.Contributors') }}</h2>
        <div
          class="flex flex-wrap mt-5 gap-3"
          *ngIf="{
            loading: contributorsLoading$ | async,
            data: contributors$ | async
          } as contributorsState"
        >
          <ng-container
            *ngIf="contributorsState.loading; else displayContributors"
          >
            <div
              *mflowwViewRepeat="5"
              class="animate-pulse bg-mfloww_fg rounded-full w-12 h-12"
            ></div>
          </ng-container>
          <ng-template #displayContributors>
            <div
              *ngFor="let contributor of contributorsState.data"
              class="flex flex-col w-12"
            >
              <a
                [href]="contributor.profileUrl"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  [src]="contributor.photoUrl"
                  [alt]="contributor.username"
                  [title]="contributor.username"
                  class="rounded-full bg-transparent w-12"
                />
              </a>
            </div>
          </ng-template>
        </div>
      </div>
    </section>
  `,
})
export default class TeamComponent {
  members: Member[] = [
    {
      fullname: 'Besim Gürbüz',
      title: 'Team.Member.BesimGurbuzTitle',
      photoUrl: 'assets/members/besim-gurbuz.jpeg',
      links: [
        {
          icon: 'twitter',
          href: 'https://twitter.com/besimdev',
        },
        {
          icon: 'github',
          href: 'https://github.com/besimgurbuz',
        },
      ],
    },
  ];

  cosntributorsService = inject(ContributorsService);
  contributors$ = this.cosntributorsService.fetchContributors$();
  contributorsLoading$ = this.cosntributorsService.contributorsLoading$;
}

type Member = {
  fullname: string;
  title: string;
  photoUrl: string;
  links: SocialMediaProfile[];
};

type SocialMediaProfile = {
  icon: Icon;
  href: string;
};
