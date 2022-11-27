// Copyright 2016-2019, Pulumi Corporation.  All rights reserved.

import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

// Create a mapping from 'route' to a count
const productTable = new aws.dynamodb.Table('Product', {
  attributes: [
    { name: 'pk', type: 'S' },
    { name: 'sk', type: 'S' },
  ],
  hashKey: 'pk',
  rangeKey: 'sk',
  readCapacity: 5,
  writeCapacity: 5,
});

interface ProductPriceDTO {
  id: string;
  name: string;
  region: string;
  currency: string;
  centValue: number;
  validFrom: string;
  validTo?: string;
}

const eifelDK: ProductPriceDTO = {
  id: '10307',
  name: 'Eifel Tower',
  region: 'DK',
  currency: 'DKK',
  centValue: 489900,
  validFrom: '1668466800',
};

const eifelUS: ProductPriceDTO = {
  id: '10307',
  name: 'Eifel Tower',
  region: 'US',
  currency: 'USD',
  centValue: 62999,
  validFrom: '1668466800',
};

const titanicDK: ProductPriceDTO = {
  id: '10294',
  name: 'Eifel Tower',
  region: 'DK',
  currency: 'DKK',
  centValue: 529900,
  validFrom: '1668466800',
};

const productsForSeeding = [eifelDK, eifelUS, titanicDK];

// Create an API endpoint
const endpoint = new awsx.apigateway.API('pricing', {
  routes: [
    {
      path: '/seed',
      method: 'POST',
      eventHandler: async (event) => {
        let result;
        try {
          const client = new aws.sdk.DynamoDB.DocumentClient();
          const talbeName = productTable.name.get();

          const productDocs = productsForSeeding.map((product) => {
            return {
              pk: product.id,
              sk: product.region,
              region: product.region,
              currency: product.currency,
              centValue: product.centValue,
              validFrom: product.validFrom,
            };
          });

          const putRequests = productDocs.map((productDoc) => {
            return {
              PutRequest: {
                Item: productDoc,
              },
            };
          });

          result = await client
            .batchWrite({
              RequestItems: {
                [talbeName]: putRequests,
              },
            })
            .promise();
        } catch (error) {
          return {
            statusCode: error.statusCode,
            body: JSON.stringify(error),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ result }),
        };
      },
    },
    {
      path: '/products/prices',
      method: 'GET',
      eventHandler: async (event) => {
        let result: {
          count: number;
          prices: ProductPriceDTO[];
        };

        const client = new aws.sdk.DynamoDB.DocumentClient();

        const { Items = [], Count } = await client
          .scan({ TableName: productTable.name.get() })
          .promise();

        const products = Items?.map((item) => {
          let newProduct: ProductPriceDTO = {
            id: item.pk,
            name: item.name,
            region: item.sk,
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
      },
    },
  ],
});

exports.endpoint = endpoint.url;
