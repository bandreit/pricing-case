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
    let [priceId, region] = item.sk.split('#');
    let newProduct: ProductPriceDTO = {
      id: item.pk,
      name: item.name,
      priceId,
      region,
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
