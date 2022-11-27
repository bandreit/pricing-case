// Copyright 2016-2019, Pulumi Corporation.  All rights reserved.

import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { seedHandler, pricesHandler } from './handlers';

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
      eventHandler: seedHandler,
    },
  ],
});

exports.endpoint = endpoint.url;
