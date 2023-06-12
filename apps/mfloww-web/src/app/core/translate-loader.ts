import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, catchError, of, tap } from 'rxjs';
import { TranslateStateService } from './translate.state';

export class StatefullTranslateLoader extends TranslateHttpLoader {
  constructor(http: HttpClient, private translateState: TranslateStateService) {
    super(http);
  }

  override getTranslation(lang: string): Observable<object> {
    this.translateState.setLoadingState(true);
    return super.getTranslation(lang).pipe(
      tap(() => this.translateState.setLoadingState(false)),
      catchError(() => {
        this.translateState.setLoadingState(false);
        return of({});
      })
    );
  }
}
