import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
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
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { MflowwIconComponent } from '../icon/icon.component';

@Directive({
  selector: 'ng-template[mflowwViewPinnedTab]',
  standalone: true,
})
export class MflowwViewPinnedTabDirective {
  templateRef = inject(TemplateRef);
}

@Directive({
  selector: 'ng-template[mflowwViewTab]',
  standalone: true,
})
export class MflowwViewTabDirective {
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
    MflowwViewPinnedTabDirective,
    MflowwViewTabDirective,
  ],
})
export class MflowwViewTabGroupComponent implements AfterViewInit {
  _showPrevButton = signal(false);
  _showNextButton = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('tabsContainer', { read: ElementRef })
  tabsContainer!: ElementRef;

  @ContentChild(MflowwViewPinnedTabDirective)
  pinnedTab!: MflowwViewPinnedTabDirective;

  @ContentChildren(MflowwViewTabDirective)
  tabs!: QueryList<MflowwViewTabDirective>;

  ngAfterViewInit(): void {
    const tabsContainerDiv = this.tabsContainer.nativeElement as HTMLDivElement;
    if (tabsContainerDiv.scrollWidth > tabsContainerDiv.clientWidth) {
      this._showNextButton.set(true);
    }

    this.tabs.changes
      .pipe(delay(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (tabsContainerDiv.scrollWidth > tabsContainerDiv.clientWidth) {
          this._showNextButton.set(true);
        }
      });
  }

  handleResize() {
    const tabsContainerDiv = this.tabsContainer.nativeElement as HTMLDivElement;

    this._showNextButton.set(
      tabsContainerDiv.clientWidth < tabsContainerDiv.scrollWidth
    );
    this._showPrevButton.set(tabsContainerDiv.scrollWidth > 0);
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
    this._showPrevButton.set(target.scrollLeft - 5 > 0);
    this._showNextButton.set(
      target.scrollLeft + 5 < target.scrollWidth - target.clientWidth
    );
  }
}
