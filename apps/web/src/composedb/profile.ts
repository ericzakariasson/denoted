import { composeClient } from "../lib/compose";

type GetProfileData = {
  viewer: {
    id: string;
    profile?: {
      address: string;
    };
  };
};

export async function getProflle() {
  return composeClient.executeQuery<GetProfileData>(`
query {
  viewer {
    id
    profile {
      address
    }
  }
}
`);
}

type ProfileInput = {
  name?: string;
  address: string;
};

export async function createProfile({ name, address }: ProfileInput) {
  return await composeClient.executeQuery(`
      mutation {
        createProfile(input: {content: {name: "${name}", address: "${address}"}}) {
          document {
            address
          }
        }
      }
      `);
}
