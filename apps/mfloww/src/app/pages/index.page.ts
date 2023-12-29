import { RouteMeta } from '@analogjs/router';
import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon, MflowwIconComponent } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { LandingImageComponent } from '../components/landing-image/landing-image.component';
import { shouldDisplayWhenLoggedOut } from '../core/route-guards';
import { FadeDirective } from '../directives/fade/fade.directive';

export const routeMeta: RouteMeta = {
  title: () => inject(TranslocoService).translate('App.MainTitle'),
  canActivate: [shouldDisplayWhenLoggedOut],
};

@Component({
  standalone: true,
  selector: 'mfloww-home',
  imports: [
    NgForOf,
    FadeDirective,
    MflowwIconComponent,
    LandingImageComponent,
    TranslocoDirective,
    RouterLink,
  ],
  template: `
    <ng-container *transloco="let t">
      <section
        class="lg:px-28 md:px-18 px-6 pt-5 md:pt-10 pb-24 flex flex-col gap-[75px] md:gap-[150px] overflow-hidden"
      >
        <main
          class="flex flex-wrap items-center justify-center gap-5 lg:gap-0"
          mflowwFade="out"
          [mflowwFadeDelay]="200"
        >
          <div class="order-2 w-full lg:order-1 lg:w-2/4 flex flex-col gap-2">
            <a
              href="https://github.com/besimgurbuz/mfloww"
              class="flex h-5 gap-2 text-[12px] fade-out font-mono items-center rounded bg-mfloww_bg-300 active:ring focus:ring w-fit ml-1 p-4 hover:cursor-pointer order-3 lg:order-1 self-center lg:self-start"
            >
              <mfloww-view-icon type="github" class="w-5"></mfloww-view-icon>
              {{ t('Landing.StarOnGitHub') }}
            </a>
            <h1
              class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-[76px] text-mfloww_success text-center lg:text-left order-1 lg:order-2"
              [innerHTML]="t('Landing.HeroHeader')"
            ></h1>
            <p
              class="text-mfloww_fg-300 ml-1 pt-4 text-center lg:text-left order-2 lg:order-3"
            >
              {{ t('Landing.HeroText') }}
            </p>
          </div>
          <mfloww-landing-image class="order-1 lg:order-2 w-[60%] md:w-[50%]">
          </mfloww-landing-image>
        </main>
      </section>
      <section
        class="bg-mfloww_bg w-full mt-12 lg:px-28 md:px-18 px-6"
        mflowwFade="out"
        [mflowwFadeDelay]="500"
      >
        <div class="w-full flex justify-between flex-wrap gap-2">
          <div
            class="flex items-center gap-3 px-2 py-4 basis-full md:basis-[calc(50%-4px)] border rounded-lg border-gray-700 shadow-lg-mfloww_bg-300"
            *ngFor="let feature of features"
          >
            <mfloww-view-icon
              class="basis-12 flex-shrink-0 text-gray-300"
              [type]="feature.icon"
            ></mfloww-view-icon>
            <div>
              <h1 class="text-[16px] text-mfloww_success">
                {{ t('Landing.InfluenceHeader' + feature.textIndex) }}
              </h1>
              <p class="text-md text-gray-300 font-roboto font-light">
                {{ t('Landing.InfluenceDesc' + feature.textIndex) }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col gap-8 justify-center items-center px-6 py-10 md:py-16 md:px-28 min-h-[400px] w-full"
          mflowwFade="in"
        >
          <h1 class="text-xl xs:text-3xl text-center">
            {{ t('Landing.StartUsingNow') }}
          </h1>
          <a
            class="px-5 py-2 border-2 border-solid rounded text-mfloww_white hover:bg-mfloww_white hover:text-mfloww_bg hover:cursor-pointer"
            routerLink="/sign-in"
          >
            {{ t('Common.SignIn') }}
          </a>
        </div>
      </section>
    </ng-container>
  `,
})
export default class HomeComponent {
  features: { icon: Icon; textIndex: number }[] = [
    { icon: 'lock', textIndex: 1 },
    { icon: 'currency_exchange', textIndex: 2 },
    { icon: 'graph', textIndex: 3 },
    { icon: 'code', textIndex: 4 },
  ];
}
