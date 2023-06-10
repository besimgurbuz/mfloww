import { Release } from '@mfloww/common';
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReleasesService } from './releases.service';

@Controller({
  path: '/releases',
})
export class ReleasesController {
  constructor(private releasesService: ReleasesService) {}

  @Get()
  getReleases(): Observable<Release[]> {
    return this.releasesService.loadProjectReleases$();
  }
}
