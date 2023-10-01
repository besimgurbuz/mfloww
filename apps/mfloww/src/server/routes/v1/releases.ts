import { defineEventHandler } from 'h3';
import { Release } from '../../../types/release';

interface ReleasesResponse {
  id: number;
  html_url: string;
  name: string;
  published_at: string;
  body: string;
}

const {
  GITHUB_API_URL,
  GITHUB_PROJECT_OWNER,
  GITHUB_PROJECT_NAME,
  GITHUB_ACCESS_TOKEN,
} = process.env;

const handler = async (): Promise<Release[]> => {
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_PROJECT_OWNER}/${GITHUB_PROJECT_NAME}/releases`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      },
    }
  );
  const json = (await response.json()) as ReleasesResponse[];

  return json.map((releaseRawBody) => ({
    id: releaseRawBody.id,
    name: releaseRawBody.name,
    url: releaseRawBody.html_url,
    publishedAt: releaseRawBody.published_at,
    body: releaseRawBody.body,
  }));
};

export default defineEventHandler(handler);
