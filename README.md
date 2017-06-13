# Serverless Framework Demo

Proof of concept for interacting with the Stripe API using AWS Lambda as a backend

## AWS IAM config

You will need a user with the following permissions:

> AWSLambdaFullAccess

> IAMFullAccess

> AdministratorAccess

> AmazonAPIGatewayAdministrator

> AmazonSESFullAccess

Obtain AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and store in ~/.bashrc

Add AWS_REGION as well.

## SES Policy

Add policy to allow SES SendEmail to the role associated with the IAM user

<!-- language: lang-none -->


    {
    "Version": "2012-10-17",
        "Statement": [
          {
          	"Effect": "Allow",
          	"Action": [ "ses:SendEmail" ],
          	"Resource": "arn:aws:ses:{AWS_REGION}:{AWS_ACCOUNT}:identity/*"
    	    }
         ]
    }


## Serverless setup

### NVM

Use NVM to manage your node.js versions

Serverless requires node.js 6.5.0 or later

    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

    source ~/.bashrc

### Install serverless globally

    sudo npm install -g serverless

### Serverless BASH alias

Use `sls` or `serverless` interchangeably

### Create Project

    sls create --template aws-nodejs --path path-to-my-service

    cd path-to-my-service

## Dependency setup

<!-- language: lang-none -->
    npm init
    npm i --save stripe aws-sdk

## Modify serverless.yml

### ENV Variables

AWS_REGION, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY should be already stored in ~/.bashrc

They are needed by serverless and will be used later to test in Postman

STRIPE_PUB AND STRIPE_SECRET should be also stored in ~/.bashrc

Add the stripe variables to the serverless.yml:

<!-- language: lang-none -->

    environment:
      STRIPE_PUB: ${env:STRIPE_PUB}
      STRIPE_SECRET: ${env:STRIPE_SECRET}
      REGION: ${env:AWS_REGION}

### Includes and Excludes

<!-- language: lang-none -->
    package:
      include:
        - node_modules/**
      exclude:
        - /*/\.txt
        - /*/\.md
        - package.json
        - temp
### Declare functions with api gateway triggers

<!-- language: lang-none -->

    functions:
      payouts:
        handler: payouts.payoutsHandler
        events:
          - http:
              path: payouts
              method: get

      balance:
        handler: balance.balanceHandler
        events:
          - http:
              path: balance
              method: get

      sendemail:
        handler: sendemail.sendemailHandler
        memorySize: 1024
        events:
          - http:
              path: sendemail
              method: post
              integration: lambda

## Invoke Locally

    sls invoke local -f FUNCTION-NAME

TODO: invoke post method instructions..... --data {...}

## Deploy To Lambda

Essentially commits a version to lambda which can be rolled back

Use for initial commit as well as future updates

    sls deploy -v

## Update single functions

Replace FN with function name

    sls deploy -f FN

## List Deployments

    sls deploy list

<!-- language: lang-none -->

    Serverless: Listing deployments:
    Serverless: -------------
    Serverless: Timestamp: 1496728264151
    Serverless: Datetime: 2017-06-06T05:51:04.151Z
    Serverless: Files:
    Serverless: - compiled-cloudformation-template.json
    Serverless: - sc0.zip
    Serverless: -------------
    Serverless: Timestamp: 1496779274764
    Serverless: Datetime: 2017-06-06T20:01:14.764Z
    Serverless: Files:
    Serverless: - compiled-cloudformation-template.json
    Serverless: - sc0.zip

## Rollback

Replace TS with a timestamp from the above list

    sls rollback --timestamp TS

## Test in Postman

### get urls

    sls info

Note the endpoints section. Cut and paste into Postman or application code

<!-- language: lang-none -->

    Service Information
    service: sc0
    stage: dev
    region: us-east-1
    api keys:
      None
    endpoints:
      GET - https://{API_GATEWAY_ID}.execute-api.{AWS_REGION}.amazonaws.com/dev/payouts
      GET - https://{API_GATEWAY_ID}.execute-api.{AWS_REGION}.amazonaws.com/dev/balance
      POST - https://{API_GATEWAY_ID}.execute-api.{AWS_REGION}.amazonaws.com/dev/sendemail
    functions:
      payouts: sc0-dev-payouts
      balance: sc0-dev-balance
      sendemail: sc0-dev-sendemail




Create an environment in Postman:

[instructions](https://www.getpostman.com/docs/postman/environments_and_globals/manage_environments)

Add AWS_ACCESS_KEY and AWS_SECRET_ACCESS_KEY with corresponding values

Select the above created environment.

Paste API URL

Under Authorization set:

    AccessKey to {{AWS_ACCESS_KEY_ID}}

    SecretKey to {{AWS_SECRET_ACCESS_KEY}}

Leave AWS Region and Service Name blank

For balance and payouts select GET and hit send

For sendemail select POST

In Headers Add:

    Content-Type: application/json

For the body choose raw

add the required body items:

    {
      "bodyData": "This is the email body..........",
      "bodySubject": "Subject. Hello."
    }


### JSON Responses

Output for balance:
<!-- language: lang-none -->

    {
        "message": "SUCCESS",
        "balance": {
            "object": "balance",
            "available": [
                {
                    "currency": "cad",
                    "amount": 0,
                    "source_types": {
                        "card": 0
                    }
                }
            ],
            "connect_reserved": [
                {
                    "currency": "cad",
                    "amount": 0
                }
            ],
            "livemode": true,
            "pending": [
                {
                    "currency": "cad",
                    "amount": 0,
                    "source_types": {
                        "card": 0
                    }
                }
            ]
        }
    }

Output for payouts:
<!-- language: lang-none -->

    {
        "message": "SUCCESS",
        "payouts": {
            "object": "list",
            "data": [],
            "has_more": false,
            "url": "/v1/payouts"
        }
    }

Output for sendemail:
<!-- language: lang-none -->

    {
        "statusCode": 200,
        "body": {
            "message": "SUCCESS",
            "sesesponse": {
                "ResponseMetadata": {
                    "RequestId": "b2dee3d9-4feb-11e7-99a4-9d56844faeb7"
                },
                "MessageId": "0100015c9f94ab2e-ee1e2d5a-50eb-485c-8bc7-de0d7e455f27-000000"
            }
        }
    }
