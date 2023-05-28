import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';

@Component({
  selector: 'mfloww-view-overlay-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwOverlayPanelComponent implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  private readonly cd = inject(ChangeDetectorRef);
  _opened = false;

  @Input() centerContent = false;

  @Output() panelClosed: EventEmitter<void> = new EventEmitter();

  @ViewChild('triggerContainer')
  triggererContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('panel') panelContainer?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    if (this._opened) this.positionPanel();
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this._opened) {
      this._opened = false;
      this.panelClosed.emit();
    }
  }

  handleTriggererClicked() {
    this._opened = !this._opened;
    if (!this._opened) {
      this.panelClosed.emit();
    }
    this.cd.detectChanges();
    if (this._opened) {
      this.positionPanel();
    }
  }

  private get bodyWidth(): number {
    return this.document.querySelector('body')?.clientWidth || 0;
  }

  private get bodyHeight(): number {
    return this.document.querySelector('body')?.clientHeight || 0;
  }

  private positionPanel() {
    if (!this.panelContainer) {
      return;
    }
    const triggererOffsetLeft = this.triggererContainer?.nativeElement
      .offsetLeft as number;
    const triggererHeight = this.triggererContainer?.nativeElement
      .clientHeight as number;
    const triggererVerticalPosition =
      this.triggererContainer?.nativeElement.getBoundingClientRect()
        .top as number;

    if (triggererOffsetLeft > this.bodyWidth / 2) {
      this.panelContainer.nativeElement.style.right = '0';
    } else {
      this.panelContainer.nativeElement.style.left = '0';
    }

    if (this.centerContent) {
      const panelWidth = this.panelContainer.nativeElement.clientWidth;
      const triggerWidth =
        this.triggererContainer?.nativeElement.clientWidth ?? 0;
      this.panelContainer.nativeElement.style.left = `${
        Math.floor(triggerWidth / 2) - Math.floor(panelWidth / 2)
      }px`;
    }
    const panelHeight = this.panelContainer.nativeElement.clientHeight;
    if (this.bodyHeight - triggererVerticalPosition - panelHeight <= 0) {
      this.panelContainer.nativeElement.style.bottom = `${
        triggererHeight + 5
      }px`;
    } else {
      this.panelContainer.nativeElement.style.top = `${triggererHeight + 5}px`;
    }
  }
}
