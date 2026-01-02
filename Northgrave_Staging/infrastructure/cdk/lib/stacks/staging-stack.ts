import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface StagingStackProps extends cdk.StackProps {
  domainName: string;
}

export class StagingStack extends cdk.Stack {
  public readonly bucket: s3.IBucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: StagingStackProps) {
    super(scope, id, props);

    const { domainName } = props;

    // Import existing S3 Bucket
    this.bucket = s3.Bucket.fromBucketName(this, 'StagingBucket', domainName);

    // Look up existing hosted zone (assumes it exists)
    // In a real deployment, you might create this or import it
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'northgrave.com',
    });

    // ACM Certificate for CloudFront (must be in us-east-1)
    const certificate = new acm.Certificate(this, 'StagingCertificate', {
      domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // CloudFront Origin Access Control
    const oac = new cloudfront.S3OriginAccessControl(this, 'StagingOAC', {
      originAccessControlName: `${domainName}-oac`,
      description: 'OAC for Northgrave staging site',
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    // CloudFront Distribution
    this.distribution = new cloudfront.Distribution(this, 'StagingDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
          originAccessControl: oac,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      },
      domainNames: [domainName],
      certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

    // DNS Record
    new route53.ARecord(this, 'StagingAliasRecord', {
      zone: hostedZone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution)
      ),
    });

    // Grant CloudFront access to S3
    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [this.bucket.arnForObjects('*')],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`,
          },
        },
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'Staging S3 bucket name',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'Staging CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `https://${domainName}`,
      description: 'Staging site URL',
    });
  }
}
