import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'mfloww-banner',
  template: `
    <a [routerLink]="link" *ngIf="useAsLink; else content">
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </a>
    <ng-template #content>
      <h1
        class="w-fit"
        [ngClass]="{
          'text-lg': size === 'normal',
          'text-xl': size === 'bigger'
        }"
      >
        <span class="text-mfloww_success">m</span
        ><span class="text-mfloww_blue">floww</span>
      </h1>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        width: fit-content;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet, NgIf, NgClass],
})
export class BannerComponent {
  @Input() useAsLink = true;
  @Input() link = '/';
  @Input() size: 'normal' | 'bigger' = 'normal';
}
