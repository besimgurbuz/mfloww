import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[mflowwViewRepeat]',
  standalone: true,
})
export class MflowwRepeatDirective {
  @Input() set mflowwViewRepeat(count: number) {
    this.viewContainer.clear();
    for (let i = 0; i < count; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: i });
    }
  }

  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
}
