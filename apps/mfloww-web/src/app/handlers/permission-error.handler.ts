import { ErrorHandler } from '@angular/core';

export class PermissionErrorHandler implements ErrorHandler {
  handleError(error: DOMException | Error): void {
    console.error('TODO: implement PermissionErrorHandler', error);
  }
}
