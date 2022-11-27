import { productTable } from '../utils/db';
import * as aws from '@pulumi/aws';

export const createPriceHandler = async () => {
  let result;
  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();

    result = await client
      .batchWrite({
        RequestItems: {
          [productTable.name.get()]: putRequests,
        },
      })
      .promise();
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  };
};
