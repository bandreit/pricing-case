import * as aws from '@pulumi/aws';
import { dtosToProducts, productTable } from '../utils/db';
import { ProductPriceDTO } from '../types/price.type';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { handleError } from '../utils/errors';

export const productPricesHandler = async (event: APIGatewayProxyEvent) => {
  let result: {
    count: number;
    prices: ProductPriceDTO[];
  } = { count: 0, prices: [] };

  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();
    const productId = event.pathParameters!['productId'];
    const region = event.queryStringParameters?.region;

    if (productId == null) {
      throw new Error('No product was specified');
    }

    let queryObject;

    queryObject = {
      TableName: productTable.name.get(),
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: {
        ':pk': productId,
      },
    };

    if (region != null) {
      queryObject = {
        TableName: productTable.name.get(),
        KeyConditionExpression: '#pk = :pk',
        FilterExpression: '#region = :region',
        ExpressionAttributeNames: { '#pk': 'pk', '#region': 'region' },
        ExpressionAttributeValues: {
          ':pk': productId,
          ':region': region,
        },
      };
    }

    const { Items = [], Count } = await client.query(queryObject).promise();

    const products = dtosToProducts(Items);

    result = { count: Count || 0, prices: products };
  } catch (error) {
    return handleError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
