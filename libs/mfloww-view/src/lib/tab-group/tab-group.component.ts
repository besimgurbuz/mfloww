import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { MflowwIconComponent } from '../icon/icon.component';

@Directive({
  selector: 'ng-template[mflowwViewPinnedTab]',
  standalone: true,
})
export class MflowwPinnedTabDirective {
  templateRef = inject(TemplateRef);
}

@Directive({
  selector: 'ng-template[mflowwViewTab]',
  standalone: true,
})
export class MflowwTabDirective {
  templateRef = inject(TemplateRef);
}

@Component({
  selector: 'mfloww-view-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgForOf,
    NgClass,
    NgIf,
    MflowwIconComponent,
    MflowwPinnedTabDirective,
    MflowwTabDirective,
  ],
})
export class MflowwTabGroupComponent implements AfterViewInit {
  _showPrevButton = false;
  _showNextButton = false;

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('tabsContainer', { read: ElementRef, static: true })
  tabsContainer!: ElementRef;

  @ContentChild(MflowwPinnedTabDirective)
  pinnedTab?: MflowwPinnedTabDirective;

  @ContentChildren(MflowwTabDirective)
  tabs!: QueryList<MflowwTabDirective>;

  private readonly cd = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    const tabsContainerDiv = this.tabsContainer.nativeElement as HTMLDivElement;
    if (tabsContainerDiv.scrollWidth > tabsContainerDiv.clientWidth) {
      this._showNextButton = true;
      this.cd.detectChanges();
    }

    this.tabs.changes
      .pipe(delay(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (tabsContainerDiv.scrollWidth > tabsContainerDiv.clientWidth) {
          this._showNextButton = true;
        }
      });
  }

  handleResize() {
    const tabsContainerDiv = this.tabsContainer.nativeElement as HTMLDivElement;

    this._showNextButton =
      tabsContainerDiv.clientWidth < tabsContainerDiv.scrollWidth;
    this._showPrevButton = tabsContainerDiv.scrollLeft > 0;
  }

  handlePrevBtnClick() {
    const tabsContainerDiv = this.tabsContainer.nativeElement as HTMLDivElement;
    const nextScrollPosition = tabsContainerDiv.scrollLeft - 400;

    tabsContainerDiv.scrollTo({ left: nextScrollPosition, behavior: 'smooth' });
  }

  handleNextBtnClick() {
    const tabsContainerDiv = this.tabsContainer.nativeElement as HTMLDivElement;
    const nextScrollPosition = tabsContainerDiv.scrollLeft + 400;

    tabsContainerDiv.scrollTo({ left: nextScrollPosition, behavior: 'smooth' });
  }

  async handleTabsContainerScroll() {
    const target = this.tabsContainer.nativeElement as HTMLDivElement;

    await Promise.resolve();
    this._showPrevButton = target.scrollLeft - 5 > 0;
    this._showNextButton =
      target.scrollLeft + 5 < target.scrollWidth - target.clientWidth;
  }
}
