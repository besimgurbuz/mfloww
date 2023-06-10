import { Component, TrackByFunction, inject } from '@angular/core';
import { marked } from 'marked';
import { Observable, map } from 'rxjs';
import { ReleasesService } from './services/releases.service';

type Changelog = {
  id: number;
  title: string;
  url: string;
  date: string;
  body: string;
  descriptionExtended?: boolean;
};

@Component({
  selector: 'mfloww-changelog',
  templateUrl: './changelog.component.html',
})
export class ChangelogComponent {
  releasesService = inject(ReleasesService);
  changelogsLoading$?: Observable<boolean> =
    this.releasesService.releasesLoading$;
  changelogs$?: Observable<Changelog[]> = this.releasesService
    .loadReleases$()
    .pipe(
      map((releases) =>
        releases.map((release) => ({
          id: release.id,
          title: release.name,
          url: release.url,
          date: release.publishedAt,
          body: marked.parse(release.body),
        }))
      )
    );
  trackByFn: TrackByFunction<Changelog> = (_: number, item: Changelog) =>
    item.id;
}
