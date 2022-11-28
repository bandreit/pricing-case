import * as aws from '@pulumi/aws';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ProductPriceDTO } from '../types/price.type';

export const productTable = new aws.dynamodb.Table('Product', {
  attributes: [
    { name: 'pk', type: 'S' },
    { name: 'sk', type: 'S' },
  ],
  hashKey: 'pk',
  rangeKey: 'sk',
  readCapacity: 5,
  writeCapacity: 5,
});

export const dtosToProducts = (Items: DocumentClient.ItemList) => {
  return Items?.map((item) => {
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
};
