import { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { MflowwRepeatDirective } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

export const routeMeta: RouteMeta = {
  title: () => `${inject(TranslocoService).translate('Common.FAQ')} | mfloww`,
};

@Component({
  standalone: true,
  imports: [MflowwRepeatDirective, TranslocoDirective],
  template: `
    <section
      *transloco="let t"
      class="lg:px-[300px] md:px-[150px] px-10 pt-4 md:pt-8 pb-44 flex flex-col gap-10"
    >
      <span class="invisible text-blue-500"></span>
      <h1 class="text-xl">{{ t('FAQ.Title') }}</h1>
      <div *mflowwViewRepeat="7; let i">
        <h3 class="text-md">{{ t('FAQ.FAQTitle' + (i + 1)) }}</h3>
        <p
          class="text-md font-roboto font-light"
          [innerHTML]="t('FAQ.FAQText' + (i + 1))"
        ></p>
      </div>
    </section>
  `,
})
export default class FAQComponent {}
