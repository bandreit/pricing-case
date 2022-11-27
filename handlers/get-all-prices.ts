import * as aws from '@pulumi/aws';
import { productTable } from '../utils/db';
import { ProductPriceDTO } from '../types/price.type';

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