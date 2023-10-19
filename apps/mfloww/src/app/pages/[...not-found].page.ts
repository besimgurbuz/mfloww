import { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

export const routeMeta: RouteMeta = {
  title: () => '404 | mfloww',
};

@Component({
  standalone: true,
  imports: [TranslocoPipe],
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
  template: `
    <div
      class="flex flex-col px-6 pt-16 pb-72 gap-5 justify-start items-center w-full h-full text-center"
    >
      <h1 class="text-4xl md:text-8xl text-mfloww_fatal">404</h1>
      <p>{{ 'App.404.message' | transloco }}</p>
      <h3 class="text-xl rounded bg-mfloww_fg-500 p-2">
        <code>{{ currentUrl }}</code>
      </h3>
    </div>
  `,
})
export default class PageNotFoundComponent {
  currentUrl = inject(Router).url;
}
