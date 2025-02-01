import { DynamoDBClient, ListBackupsCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" } as any);

export const FetchDynamoClient = () => {
    return new DynamoDBClient({ region: "us-east-1" } as any);
}

const params = {
    /** input parameters */
};