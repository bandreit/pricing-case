import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import * as util from 'util';
import { VerifiedJWT } from '../types/auth.type';

const config = new pulumi.Config();
const jwksUri = config.require('jwksUri');
const audience = config.require('audience');
const issuer = config.require('issuer');

export const authorizerLambda = async (
  event: awsx.apigateway.AuthorizerEvent
) => {
  try {
    return await authenticate(event);
  } catch (err) {
    console.log(err);
    // Tells API Gateway to return a 401 Unauthorized response
    throw new Error('Unauthorized');
  }
};

export const authorizer = awsx.apigateway.getTokenLambdaAuthorizer({
  authorizerName: 'jwt-rsa-custom-authorizer',
  header: 'Authorization',
  handler: authorizerLambda,
  identityValidationExpression: '^Bearer [-0-9a-zA-Z._]*$',
  authorizerResultTtlInSeconds: 3600,
});

function getToken(event: awsx.apigateway.AuthorizerEvent): string {
  if (!event.type || event.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const tokenString = event.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }

  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match) {
    throw new Error(
      `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`
    );
  }
  return match[1];
}

// Check the Token is valid with Auth0
async function authenticate(
  event: awsx.apigateway.AuthorizerEvent
): Promise<awsx.apigateway.AuthorizerResponse> {
  console.log(event);
  const token = getToken(event);

  const decoded = jwt.decode(token, { complete: true });
  if (
    !decoded ||
    typeof decoded === 'string' ||
    !decoded.header ||
    !decoded.header.kid
  ) {
    throw new Error('invalid token');
  }

  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10, // Default value
    jwksUri: jwksUri,
  });

  const key = await util.promisify(client.getSigningKey)(decoded.header.kid);
  const signingKey = key?.getPublicKey() || key?.getPublicKey();
  if (!signingKey) {
    throw new Error('could not get signing key');
  }

  const verifiedJWT = await jwt.verify(token, signingKey, { audience, issuer });
  if (
    !verifiedJWT ||
    typeof verifiedJWT === 'string' ||
    !isVerifiedJWT(verifiedJWT)
  ) {
    throw new Error('could not verify JWT');
  }
  return awsx.apigateway.authorizerResponse(
    verifiedJWT.sub,
    'Allow',
    event.methodArn
  );
}

function isVerifiedJWT(
  toBeDetermined: VerifiedJWT | Object
): toBeDetermined is VerifiedJWT {
  return (<VerifiedJWT>toBeDetermined).sub !== undefined;
}
