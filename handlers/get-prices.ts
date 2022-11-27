import * as aws from '@pulumi/aws';
import { productTable } from '../utils/db';
import { ProductPriceDTO } from '../types/price.type';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const productPricesHandler = async (event: APIGatewayProxyEvent) => {
  let result: {
    count: number;
    prices: ProductPriceDTO[];
  } = { count: 0, prices: [] };

  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();
    const productId = event.pathParameters!['productId'];
    if (productId == null) {
      throw new Error('No product was specified');
    }

    const { Items = [], Count } = await client
      .query({
        TableName: productTable.name.get(),
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: { '#pk': 'pk' },
        ExpressionAttributeValues: {
          ':pk': productId,
        },
      })
      .promise();

    const products = Items?.map((item) => {
      let newProduct: ProductPriceDTO = {
        productId: item.pk,
        name: item.name,
        priceId: item.sk,
        region: item.region,
        currency: item.currency,
        centValue: item.centValue,
        validFrom: item.validFrom,
        validTo: item.validTo,
      };
      return newProduct;
    });

    result = { count: Count || 0, prices: products };
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
