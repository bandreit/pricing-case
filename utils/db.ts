import * as aws from '@pulumi/aws';

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

export const client = new aws.sdk.DynamoDB.DocumentClient();
