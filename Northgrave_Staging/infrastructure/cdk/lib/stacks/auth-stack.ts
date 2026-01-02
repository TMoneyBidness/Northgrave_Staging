import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class AuthStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Secret for vault password
    const vaultSecret = new secretsmanager.Secret(this, 'VaultPassword', {
      secretName: 'northgrave/vault-password',
      description: 'Shared password for Northgrave vault access',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ password: 'CHANGE_ME' }),
        generateStringKey: 'generated',
        excludeCharacters: '"@/\\',
        passwordLength: 32,
      },
    });

    // Secret for CloudFront signing key
    const signingKeySecret = new secretsmanager.Secret(this, 'SigningKey', {
      secretName: 'northgrave/cloudfront-signing-key',
      description: 'CloudFront signing key for vault cookies',
    });

    // Lambda function for authentication
    const authFunction = new lambda.Function(this, 'VaultAuthFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        // Placeholder - replace with actual implementation from lambda/vault-auth
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': 'true',
            },
            body: JSON.stringify({ message: 'Auth endpoint ready' }),
          };
        };
      `),
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      environment: {
        VAULT_SECRET_ARN: vaultSecret.secretArn,
        SIGNING_KEY_SECRET_ARN: signingKeySecret.secretArn,
        COOKIE_DOMAIN: '.northgrave.com',
        COOKIE_TTL_HOURS: '24',
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    // Grant Lambda access to secrets
    vaultSecret.grantRead(authFunction);
    signingKeySecret.grantRead(authFunction);

    // API Gateway
    this.api = new apigateway.RestApi(this, 'VaultAuthApi', {
      restApiName: 'Northgrave Vault Auth',
      description: 'Authentication API for Northgrave vault access',
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://northgrave.com', 'https://staging.northgrave.com'],
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
        allowCredentials: true,
      },
      deployOptions: {
        stageName: 'v1',
        throttlingBurstLimit: 50,
        throttlingRateLimit: 100,
      },
    });

    // Auth endpoint
    const authResource = this.api.root.addResource('auth');
    authResource.addMethod('POST', new apigateway.LambdaIntegration(authFunction), {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Set-Cookie': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
          },
        },
        { statusCode: '401' },
        { statusCode: '429' },
      ],
    });

    // WAF Web ACL for rate limiting
    const webAcl = new wafv2.CfnWebACL(this, 'AuthWafAcl', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'NorthgraveAuthWaf',
        sampledRequestsEnabled: true,
      },
      rules: [
        {
          name: 'RateLimitRule',
          priority: 1,
          action: { block: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimitRule',
            sampledRequestsEnabled: true,
          },
          statement: {
            rateBasedStatement: {
              limit: 100, // 100 requests per 5 minutes per IP
              aggregateKeyType: 'IP',
            },
          },
        },
      ],
    });

    // Associate WAF with API Gateway
    new wafv2.CfnWebACLAssociation(this, 'WafApiAssociation', {
      resourceArn: this.api.deploymentStage.stageArn,
      webAclArn: webAcl.attrArn,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.url,
      description: 'Vault auth API endpoint',
    });

    new cdk.CfnOutput(this, 'VaultSecretArn', {
      value: vaultSecret.secretArn,
      description: 'ARN for vault password secret',
    });
  }
}
