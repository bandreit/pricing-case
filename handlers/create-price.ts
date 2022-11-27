import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { PricePayload, ProductPriceDbDoc } from '../types/price.type';
import { productTable } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const createPriceHandler = async (event: APIGatewayProxyEvent) => {
  let result;

  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();
    const productId = event.pathParameters!['productId'];

    if (productId == null) {
      throw new Error('No product was specified');
    }

    let body = event.body ?? '{}';
    let buff = new Buffer(body, 'base64');
    let jsonBody = buff.toString('ascii');

    const data: PricePayload = JSON.parse(jsonBody);

    if (data.region == null) {
      throw new Error('No region was specified');
    }

    if (data.currency == null) {
      throw new Error('No currency was specified');
    }

    if (data.centValue == null) {
      throw new Error('No centValue was specified');
    }

    if (data.validFrom == null) {
      throw new Error('No validFrom was specified');
    }

    const priceToCreate: ProductPriceDbDoc = {
      pk: `${productId}#${uuidv4()}`,
      sk: data.region,
      region: data.region,
      currency: data.currency,
      centValue: data.centValue,
      validFrom: data.validFrom,
    };

    await client
      .put({
        TableName: productTable.name.get(),
        Item: priceToCreate,
      })
      .promise();

    result = priceToCreate;
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
    statusCode: 201,
    body: JSON.stringify(result),
  };
};
