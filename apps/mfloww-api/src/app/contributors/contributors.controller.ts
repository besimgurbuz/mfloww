import { Controller, Get } from '@nestjs/common';
import { ContributorsService } from './contributors.service';

@Controller({
  path: '/contributors',
})
export class ContributorsController {
  constructor(private contributorsService: ContributorsService) {}

  @Get()
  getContributors() {
    return this.contributorsService.loadProjectContributors$();
  }
}
