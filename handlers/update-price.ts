import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { PricePayload, ProductPriceDbDoc } from '../types/price.type';
import { productTable } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const updatePriceHandler = async (event: APIGatewayProxyEvent) => {
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

    if (data.validTo == null) {
      throw new Error('No validTo was specified');
    }

    const { currency, region, centValue, validFrom, validTo } = data;

    const patchObject = {
      ...(currency && { currency }),
      ...(region && { region }),
      ...(centValue && { centValue }),
      ...(validFrom && { validFrom }),
      ...(validTo && { validTo }),
    };

    let updateExpression = '';
    let updateExpressionAttributeNames: any = {};
    let updateExpressionAttributeValues: any = {};

    Object.entries(patchObject).forEach(([key, value]) => {
      // dynamically build the update expression based on the keys in the patch object
      updateExpression += `${
        updateExpression.length > 0
          ? `, #${key} = :${key} `
          : `SET #${key} = :${key} `
      }`;
      updateExpressionAttributeNames[`#${key}`] = key;
      updateExpressionAttributeValues[`:${key}`] = value;
    });

    await client
      .update({
        TableName: productTable.name.get(),
        Key: { pk: productId, sk: priceId },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: updateExpressionAttributeNames,
        ExpressionAttributeValues: updateExpressionAttributeValues,
        ConditionExpression: 'attribute_exists(pk)',
      })
      .promise();

    result = data;
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
