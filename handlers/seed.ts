import { productTable } from '../utils/db';
import { productsForSeeding } from '../utils/seeder';
import * as aws from '@pulumi/aws';
import { v4 as uuidv4 } from 'uuid';

export const seedHandler = async () => {
  let result;
  try {
    const client = new aws.sdk.DynamoDB.DocumentClient();

    const productDocs = productsForSeeding.map((product) => {
      return {
        pk: product.productId,
        sk: uuidv4(),
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
          [productTable.name.get()]: putRequests,
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
    statusCode: 201,
    body: JSON.stringify({ result }),
  };
};
