import { Release } from '@mfloww/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ReleasesResponse } from './releases.model';

@Injectable()
export class ReleasesService {
  githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;

  constructor(private http: HttpService) {}

  get url() {
    const { GITHUB_API_URL, GITHUB_PROJECT_OWNER, GITHUB_PROJECT_NAME } =
      process.env;
    return `${GITHUB_API_URL}/repos/${GITHUB_PROJECT_OWNER}/${GITHUB_PROJECT_NAME}/releases`;
  }

  loadProjectReleases$(): Observable<Release[]> {
    return this.http
      .get<ReleasesResponse[]>(this.url, {
        headers: {
          Authorization: `Bearer ${this.githubAccessToken}`,
        },
      })
      .pipe(
        map((response) =>
          response.data.map((releaseRawBody) => ({
            id: releaseRawBody.id,
            name: releaseRawBody.name,
            url: releaseRawBody.html_url,
            publishedAt: releaseRawBody.published_at,
            body: releaseRawBody.body,
          }))
        )
      );
  }
}
