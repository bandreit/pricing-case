import * as aws from '@pulumi/aws';
import { productTable } from '../utils/db';
import { ProductPriceDTO } from '../types/price.type';

export const pricesHandler = async () => {
  let result: {
    count: number;
    prices: ProductPriceDTO[];
  };

  const client = new aws.sdk.DynamoDB.DocumentClient();

  const { Items = [], Count } = await client
    .scan({ TableName: productTable.name.get() })
    .promise();

  const products = Items?.map((item) => {
    let [productId, priceId] = item.pk.split('#');
    let newProduct: ProductPriceDTO = {
      productId,
      name: item.name,
      priceId,
      region: item.region,
      currency: item.currency,
      centValue: item.centValue,
      validFrom: item.validFrom,
      validTo: item.validTo,
    };
    return newProduct;
  });

  result = { count: Count || 0, prices: products };

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
