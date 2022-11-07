import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mflowwViewSelectOption]',
})
export class MflowwSelectOptionDirective<T> {
  @Input() value!: T;
  @Input() selected = false;

  constructor(public template: TemplateRef<HTMLElement>) {}
}
