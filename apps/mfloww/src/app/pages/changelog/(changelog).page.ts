import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, TrackByFunction, inject } from '@angular/core';
import { MflowwTrimPipe } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { marked } from 'marked';
import { Observable, map } from 'rxjs';
import { GitHubReleaseService } from './github-release.service';

export const routeMeta: RouteMeta = {
  title: () =>
    `${inject(TranslocoService).translate('Changelog.Title')} | mfloww`,
};

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MflowwTrimPipe,
    DatePipe,
    AsyncPipe,
    TranslocoDirective,
  ],
  providers: [GitHubReleaseService],
  template: `
    <section *transloco="let t" class="w-full h-full">
      <div
        class="w-full min-h-[150px] lg:px-28 md:px-18 px-6 py-3 flex flex-col justify-center border-b-[1px] border-b-gray-600"
      >
        <h3 class="text-xl">{{ t('Changelog.Title') }}</h3>
        <p
          class="font-roboto font-light"
          [innerHTML]="t('Changelog.InfoText')"
        ></p>
      </div>
      <div
        class="h-full lg:px-28 md:px-18 px-6 py-3"
        *ngIf="{
          changelogs: changelogs$ | async,
          loading: changelogsLoading$ | async
        } as data"
      >
        <div class="min-h-[400px]" *ngIf="data.loading">
          <svg
            class="animate-spin h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <ng-container *ngIf="!data.loading && !data.changelogs?.length">
          <div class="min-h-[400px]">
            <h3 class="font-roboto font-light">
              {{ t('Changelog.NotFound') }}
            </h3>
          </div>
        </ng-container>
        <div
          *ngFor="let changelog of data.changelogs; trackBy: trackByFn"
          class="flex px-4 py-10 gap-5 flex-col md:flex-row"
        >
          <div class="basis-2/5 flex-shrink-0 flex relative">
            <div class="md:sticky h-fit top-24 pl-10">
              <svg
                class="absolute left-0"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 12.75V11.25H20V12.75H4Z" fill="white" />
              </svg>
              <a
                class="text-lg hover:text-blue-400 hover:underline hover:cursor-pointer"
                target="_blank"
                rel="noreferrer"
                [href]="changelog.url"
                >{{ changelog.title }}</a
              >
              <p class="font-roboto font-light text-mfloww_fg">
                {{ changelog.date | date }}
              </p>
            </div>
          </div>
          <div
            class="basis-3/5 pb-3 pl-10 md:pl-0 font-roboto text-lg font-light border-b-[1px] border-b-gray-600 overflow-auto"
          >
            <div
              class="overflow-x-auto"
              [innerHTML]="
                changelog.body
                  | trim : (changelog.descriptionExtended ? undefined : 800)
              "
            ></div>
            <button
              class="text-gray-400 hover:underline pt-2"
              *ngIf="!changelog.descriptionExtended"
              (click)="changelog.descriptionExtended = true"
            >
              See more
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class ChangelogComponent {
  releaseService = inject(GitHubReleaseService);
  changelogsLoading$?: Observable<boolean> =
    this.releaseService.releasesLoading$;
  changelogs$?: Observable<Changelog[]> = this.releaseService
    .loadReleases$()
    .pipe(
      map((releases) =>
        releases.map((release) => ({
          id: release.id,
          title: release.name,
          url: release.url,
          date: release.publishedAt,
          body: marked.parse(release.body),
        }))
      )
    );
  trackByFn: TrackByFunction<Changelog> = (_: number, item: Changelog) =>
    item.id;
}

type Changelog = {
  id: number;
  title: string;
  url: string;
  date: string;
  body: string;
  descriptionExtended?: boolean;
};
