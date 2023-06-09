import { Contributor } from '@mfloww/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ContributorsResponse } from './contributors.model';

@Injectable()
export class ContributorsService {
  githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;

  constructor(private http: HttpService) {}

  get url() {
    const { GITHUB_API_URL, GITHUB_PROJECT_OWNER, GITHUB_PROJECT_NAME } =
      process.env;
    return `${GITHUB_API_URL}/repos/${GITHUB_PROJECT_OWNER}/${GITHUB_PROJECT_NAME}/contributors`;
  }

  loadProjectContributors$(): Observable<Contributor[]> {
    return this.http
      .get<ContributorsResponse[]>(this.url, {
        headers: {
          Authorization: `Bearer ${this.githubAccessToken}`,
        },
      })
      .pipe(
        map((response) =>
          response.data.map((contributorRawBody) => ({
            photoUrl: contributorRawBody.avatar_url,
            profileUrl: contributorRawBody.html_url,
            username: contributorRawBody.login,
          }))
        )
      );
  }
}
