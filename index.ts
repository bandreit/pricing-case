import * as awsx from '@pulumi/awsx';
import {
  seedHandler,
  pricesHandler,
  createPriceHandler,
  productPricesHandler,
  updatePriceHandler,
  removePriceHandler,
} from './handlers';
import { authorizer } from './utils/auth';

const endpoint = new awsx.apigateway.API('pricing', {
  routes: [
    {
      path: '/seed',
      method: 'POST',
      eventHandler: seedHandler,
      authorizers: authorizer,
    },
    {
      path: '/products/prices',
      method: 'GET',
      eventHandler: pricesHandler,
      authorizers: authorizer,
    },
    {
      path: '/products/{productId}/prices',
      method: 'GET',
      eventHandler: productPricesHandler,
      authorizers: authorizer,
    },
    {
      path: '/products/{productId}/prices',
      method: 'POST',
      eventHandler: createPriceHandler,
      authorizers: authorizer,
    },
    {
      path: '/products/{productId}/prices/{priceId}',
      method: 'PUT',
      eventHandler: updatePriceHandler,
      authorizers: authorizer,
    },
    {
      path: '/products/{productId}/prices/{priceId}',
      method: 'DELETE',
      eventHandler: removePriceHandler,
      authorizers: authorizer,
    },
  ],
});

exports.endpoint = endpoint.url;
