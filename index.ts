import * as awsx from '@pulumi/awsx';
import { seedHandler, pricesHandler, createPriceHandler } from './handlers';

// API endpoints
const endpoint = new awsx.apigateway.API('pricing', {
  routes: [
    {
      path: '/seed',
      method: 'POST',
      eventHandler: seedHandler,
    },
    {
      path: '/products/prices',
      method: 'GET',
      eventHandler: pricesHandler,
    },
    {
      path: '/products/{productId}/prices',
      method: 'POST',
      eventHandler: createPriceHandler,
    },
  ],
});

exports.endpoint = endpoint.url;
