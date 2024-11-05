/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import { Client, generateClient, GraphQLResult } from "aws-amplify/api";
import { Observable } from "rxjs";

export type __SubscriptionContainer = {
  onCreateMaster: OnCreateMasterSubscription;
  onUpdateMaster: OnUpdateMasterSubscription;
  onDeleteMaster: OnDeleteMasterSubscription;
  onCreateUser: OnCreateUserSubscription;
  onUpdateUser: OnUpdateUserSubscription;
  onDeleteUser: OnDeleteUserSubscription;
};

export type CreateMasterInput = {
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type Master = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type UpdateMasterInput = {
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type DeleteMasterInput = {
  PK: string;
  SK: number;
};

export type CreateUserInput = {
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type user = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type UpdateUserInput = {
  PK: string;
  SK: string;
  email?: string | null;
  phone?: string | null;
  userID?: string | null;
};

export type DeleteUserInput = {
  PK: string;
  SK: string;
};

export type TableMasterFilterInput = {
  PK?: TableStringFilterInput | null;
  SK?: TableIntFilterInput | null;
};

export type TableStringFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  size?: ModelSizeInput | null;
};

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type TableIntFilterInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
};

export type MasterConnection = {
  __typename: "MasterConnection";
  items?: Array<Master | null> | null;
  nextToken?: string | null;
};

export type TableUserFilterInput = {
  PK?: TableStringFilterInput | null;
  SK?: TableStringFilterInput | null;
  email?: TableStringFilterInput | null;
  phone?: TableIntFilterInput | null;
  userID?: TableStringFilterInput | null;
};

export type userConnection = {
  __typename: "userConnection";
  items?: Array<user | null> | null;
  nextToken?: string | null;
};

export type CreateMasterMutation = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type UpdateMasterMutation = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type DeleteMasterMutation = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type CreateUserMutation = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type UpdateUserMutation = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type DeleteUserMutation = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type GetMasterQuery = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type ListMastersQuery = {
  __typename: "MasterConnection";
  items?: Array<{
    __typename: "Master";
    PK: string;
    SK: number;
    options?: string | null;
    metadata?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type GetUserQuery = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type ListUsersQuery = {
  __typename: "userConnection";
  items?: Array<{
    __typename: "user";
    PK: string;
    SK: string;
    email: string;
    phone?: string | null;
    userID: string;
  } | null> | null;
  nextToken?: string | null;
};

export type OnCreateMasterSubscription = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type OnUpdateMasterSubscription = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type OnDeleteMasterSubscription = {
  __typename: "Master";
  PK: string;
  SK: number;
  options?: string | null;
  metadata?: string | null;
};

export type OnCreateUserSubscription = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type OnUpdateUserSubscription = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

export type OnDeleteUserSubscription = {
  __typename: "user";
  PK: string;
  SK: string;
  email: string;
  phone?: string | null;
  userID: string;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  public client: any;
  constructor() {
    this.client = generateClient();
  }
  async CreateMaster(input: CreateMasterInput): Promise<CreateMasterMutation> {
    const statement = `mutation CreateMaster($input: CreateMasterInput!) {
        createMaster(input: $input) {
          __typename
          PK
          SK
          options
          metadata
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <CreateMasterMutation>response.data.createMaster;
  }
  async UpdateMaster(input: UpdateMasterInput): Promise<UpdateMasterMutation> {
    const statement = `mutation UpdateMaster($input: UpdateMasterInput!) {
        updateMaster(input: $input) {
          __typename
          PK
          SK
          options
          metadata
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <UpdateMasterMutation>response.data.updateMaster;
  }
  async DeleteMaster(input: DeleteMasterInput): Promise<DeleteMasterMutation> {
    const statement = `mutation DeleteMaster($input: DeleteMasterInput!) {
        deleteMaster(input: $input) {
          __typename
          PK
          SK
          options
          metadata
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <DeleteMasterMutation>response.data.deleteMaster;
  }
  async CreateUser(input: CreateUserInput): Promise<CreateUserMutation> {
    const statement = `mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          __typename
          PK
          SK
          email
          phone
          userID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <CreateUserMutation>response.data.createUser;
  }
  async UpdateUser(input: UpdateUserInput): Promise<UpdateUserMutation> {
    const statement = `mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
          __typename
          PK
          SK
          email
          phone
          userID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <UpdateUserMutation>response.data.updateUser;
  }
  async DeleteUser(input: DeleteUserInput): Promise<DeleteUserMutation> {
    const statement = `mutation DeleteUser($input: DeleteUserInput!) {
        deleteUser(input: $input) {
          __typename
          PK
          SK
          email
          phone
          userID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <DeleteUserMutation>response.data.deleteUser;
  }
  async GetMaster(PK: string, SK: number): Promise<GetMasterQuery> {
    const statement = `query GetMaster($PK: String!, $SK: Int!) {
        getMaster(PK: $PK, SK: $SK) {
          __typename
          PK
          SK
          options
          metadata
        }
      }`;
    const gqlAPIServiceArguments: any = {
      PK,
      SK
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <GetMasterQuery>response.data.getMaster;
  }
  async ListMasters(
    filter?: TableMasterFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListMastersQuery> {
    const statement = `query ListMasters($filter: TableMasterFilterInput, $limit: Int, $nextToken: String) {
        listMasters(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            PK
            SK
            options
            metadata
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <ListMastersQuery>response.data.listMasters;
  }
  async GetUser(PK: string, SK: string): Promise<GetUserQuery> {
    const statement = `query GetUser($PK: String!, $SK: String!) {
        getUser(PK: $PK, SK: $SK) {
          __typename
          PK
          SK
          email
          phone
          userID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      PK,
      SK
    };
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <GetUserQuery>response.data.getUser;
  }
  async ListUsers(
    filter?: TableUserFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListUsersQuery> {
    const statement = `query ListUsers($filter: TableUserFilterInput, $limit: Int, $nextToken: String) {
        listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            PK
            SK
            email
            phone
            userID
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    })) as any;
    return <ListUsersQuery>response.data.listUsers;
  }
  OnCreateMasterListener(
    PK?: string,
    SK?: number,
    options?: string,
    metadata?: string
  ): Observable<
    GraphQLResult<Pick<__SubscriptionContainer, "onCreateMaster">>
  > {
    const statement = `subscription OnCreateMaster($PK: String, $SK: Int, $options: AWSJSON, $metadata: AWSJSON) {
        onCreateMaster(PK: $PK, SK: $SK, options: $options, metadata: $metadata) {
          __typename
          PK
          SK
          options
          metadata
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PK) {
      gqlAPIServiceArguments.PK = PK;
    }
    if (SK) {
      gqlAPIServiceArguments.SK = SK;
    }
    if (options) {
      gqlAPIServiceArguments.options = options;
    }
    if (metadata) {
      gqlAPIServiceArguments.metadata = metadata;
    }
    return this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    }) as any;
  }

  OnUpdateMasterListener(
    PK?: string,
    SK?: number,
    options?: string,
    metadata?: string
  ): Observable<
    GraphQLResult<Pick<__SubscriptionContainer, "onUpdateMaster">>
  > {
    const statement = `subscription OnUpdateMaster($PK: String, $SK: Int, $options: AWSJSON, $metadata: AWSJSON) {
        onUpdateMaster(PK: $PK, SK: $SK, options: $options, metadata: $metadata) {
          __typename
          PK
          SK
          options
          metadata
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PK) {
      gqlAPIServiceArguments.PK = PK;
    }
    if (SK) {
      gqlAPIServiceArguments.SK = SK;
    }
    if (options) {
      gqlAPIServiceArguments.options = options;
    }
    if (metadata) {
      gqlAPIServiceArguments.metadata = metadata;
    }
    return this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    }) as any;
  }

  OnDeleteMasterListener(
    PK?: string,
    SK?: number,
    options?: string,
    metadata?: string
  ): Observable<
    GraphQLResult<Pick<__SubscriptionContainer, "onDeleteMaster">>
  > {
    const statement = `subscription OnDeleteMaster($PK: String, $SK: Int, $options: AWSJSON, $metadata: AWSJSON) {
        onDeleteMaster(PK: $PK, SK: $SK, options: $options, metadata: $metadata) {
          __typename
          PK
          SK
          options
          metadata
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PK) {
      gqlAPIServiceArguments.PK = PK;
    }
    if (SK) {
      gqlAPIServiceArguments.SK = SK;
    }
    if (options) {
      gqlAPIServiceArguments.options = options;
    }
    if (metadata) {
      gqlAPIServiceArguments.metadata = metadata;
    }
    return this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    }) as any;
  }

  OnCreateUserListener(
    PK?: string,
    SK?: string,
    email?: string,
    phone?: string,
    userID?: string
  ): Observable<GraphQLResult<Pick<__SubscriptionContainer, "onCreateUser">>> {
    const statement = `subscription OnCreateUser($PK: String, $SK: String, $email: String, $phone: Long, $userID: String) {
        onCreateUser(PK: $PK, SK: $SK, email: $email, phone: $phone, userID: $userID) {
          __typename
          PK
          SK
          email
          phone
          userID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PK) {
      gqlAPIServiceArguments.PK = PK;
    }
    if (SK) {
      gqlAPIServiceArguments.SK = SK;
    }
    if (email) {
      gqlAPIServiceArguments.email = email;
    }
    if (phone) {
      gqlAPIServiceArguments.phone = phone;
    }
    if (userID) {
      gqlAPIServiceArguments.userID = userID;
    }
    return this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    }) as any;
  }

  OnUpdateUserListener(
    PK?: string,
    SK?: string,
    email?: string,
    phone?: string,
    userID?: string
  ): Observable<GraphQLResult<Pick<__SubscriptionContainer, "onUpdateUser">>> {
    const statement = `subscription OnUpdateUser($PK: String, $SK: String, $email: String, $phone: Long, $userID: String) {
        onUpdateUser(PK: $PK, SK: $SK, email: $email, phone: $phone, userID: $userID) {
          __typename
          PK
          SK
          email
          phone
          userID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PK) {
      gqlAPIServiceArguments.PK = PK;
    }
    if (SK) {
      gqlAPIServiceArguments.SK = SK;
    }
    if (email) {
      gqlAPIServiceArguments.email = email;
    }
    if (phone) {
      gqlAPIServiceArguments.phone = phone;
    }
    if (userID) {
      gqlAPIServiceArguments.userID = userID;
    }
    return this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    }) as any;
  }

  OnDeleteUserListener(
    PK?: string,
    SK?: string,
    email?: string,
    phone?: string,
    userID?: string
  ): Observable<GraphQLResult<Pick<__SubscriptionContainer, "onDeleteUser">>> {
    const statement = `subscription OnDeleteUser($PK: String, $SK: String, $email: String, $phone: Long, $userID: String) {
        onDeleteUser(PK: $PK, SK: $SK, email: $email, phone: $phone, userID: $userID) {
          __typename
          PK
          SK
          email
          phone
          userID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PK) {
      gqlAPIServiceArguments.PK = PK;
    }
    if (SK) {
      gqlAPIServiceArguments.SK = SK;
    }
    if (email) {
      gqlAPIServiceArguments.email = email;
    }
    if (phone) {
      gqlAPIServiceArguments.phone = phone;
    }
    if (userID) {
      gqlAPIServiceArguments.userID = userID;
    }
    return this.client.graphql({
      query: statement,
      variables: gqlAPIServiceArguments
    }) as any;
  }
}
