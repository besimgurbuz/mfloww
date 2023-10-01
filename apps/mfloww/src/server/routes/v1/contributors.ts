import { defineEventHandler } from 'h3';
import { Contributor } from '../../../types/contributor';

interface ContributorsResponse {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

const {
  GITHUB_API_URL,
  GITHUB_PROJECT_OWNER,
  GITHUB_PROJECT_NAME,
  GITHUB_ACCESS_TOKEN,
} = process.env;

const handler = async (): Promise<Contributor[]> => {
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_PROJECT_OWNER}/${GITHUB_PROJECT_NAME}/contributors`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      },
    }
  );
  const json = (await response.json()) as ContributorsResponse[];

  return json.map((rawBody) => ({
    photoUrl: rawBody.avatar_url,
    profileUrl: rawBody.html_url,
    username: rawBody.login,
  }));
};

export default defineEventHandler(handler);
