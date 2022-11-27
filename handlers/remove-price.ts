import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { productTable } from '../utils/db';

export const removePriceHandler = async (event: APIGatewayProxyEvent) => {
  let result;

  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();
    const productId = event.pathParameters!['productId'];
    const priceId = event.pathParameters!['priceId'];

    if (productId == null) {
      throw new Error('No product was specified');
    }
    if (priceId == null) {
      throw new Error('No price was specified');
    }

    await client
      .delete({
        TableName: productTable.name.get(),
        Key: { pk: productId, sk: priceId },
      })
      .promise();

    result = priceId;
  } catch (error) {
    let errorBody;
    let errorStatusCode = 500;

    if (error instanceof Error) {
      errorStatusCode = 400;
      errorBody = error.message;
    } else {
      errorBody = error;
    }

    return {
      statusCode: errorStatusCode,
      body: JSON.stringify(errorBody),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
