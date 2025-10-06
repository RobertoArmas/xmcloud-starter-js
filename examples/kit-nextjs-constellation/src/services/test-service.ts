import { GraphqlService } from '@constellation4sitecore-content-sdk/nextjs/graphql';
import { gql } from 'graphql-request';

export type SiteResult = {
  name: string;
};

export class TestService extends GraphqlService {
  async getSites(): Promise<SiteResult[]> {
    const client = this.getClient();

    const query = gql`
      query {
        site {
          allSiteInfo {
            results {
              name
            }
          }
        }
      }
    `;

    const response = await client.request<{
      site: {
        allSiteInfo: {
          results: SiteResult[];
        };
      };
    }>(query);

    return response.site.allSiteInfo.results;
  }
}
