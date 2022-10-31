import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[mflowwViewCopyClipboard]',
  standalone: true,
})
export class MflowwCopyClipboardDirective {
  @Input('mflowwViewCopyClipboard') content!: string | number | symbol;

  @Output() private copied: EventEmitter<string | number | symbol> =
    new EventEmitter();

  @HostListener('click', ['$event'])
  async onClick(event: MouseEvent) {
    event.preventDefault();
    if (!this.content) return;

    await navigator.clipboard.writeText(this.content.toString());
    this.copied.emit(this.content.toString());
  }
}
