import * as aws from '@pulumi/aws';
import { dtosToProducts, productTable } from '../utils/db';
import { ProductPriceDTO } from '../types/price.type';
import { handleError } from '../utils/errors';

export const pricesHandler = async () => {
  let result: {
    count: number;
    prices: ProductPriceDTO[];
  } = { count: 0, prices: [] };

  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();

    const { Items = [], Count } = await client
      .scan({ TableName: productTable.name.get() })
      .promise();

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
