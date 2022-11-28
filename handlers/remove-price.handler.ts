import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { productTable } from '../utils/db';
import { handleError } from '../utils/errors';

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
    return handleError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
