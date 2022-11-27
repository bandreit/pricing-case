import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const createPriceHandler = async (event: APIGatewayProxyEvent) => {
  let result;
  const productId = event.pathParameters!['productId'];
  // const data: Payload = JSON.parse(event.body ?? '{}');

  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();

    // result = await client
    //   .batchWrite({
    //     RequestItems: {
    //       [productTable.name.get()]: putRequests,
    //     },
    //   })
    //   .promise();
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error),
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ result }),
  };
};
