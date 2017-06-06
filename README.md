# Serverless Framework Demo

Proof of concept for interacting with the Stripe API using AWS Lambda as a backend

## AWS IAM config

You will need a user with the following permissions:

> AWSLambdaFullAccess

> IAMFullAccess

> AdministratorAccess

> AmazonAPIGatewayAdministrator

Obtain AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and store in ~/.bashrc

## Serverless setup

### NVM

Use NVM to manage your node.js versions

Serverless requires node.js 6.5.0 or later

    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

    source ~/.bashrc

### Install serverless globally

    sudo npm install -g serverless

### Create Project

    serverless create --template aws-nodejs --path path-to-my-service

    cd path-to-my-service

## Dependency setup

<!-- language: lang-none -->
    npm init
    npm i --save stripe
    sudo npm i

## Modify serverless.yml

### ENV Variables

AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY should be already stored in ~/.bashrc

They are needed by serverless and will be used later to test in Postman

STRIPE_PUB AND STRIPE_SECRET should be also stored in ~/.bashrc

Add the stripe variables to the serverless.yml:

<!-- language: lang-none -->

    environment:
      STRIPE_PUB: ${env:STRIPE_PUB}
      STRIPE_SECRET: ${env:STRIPE_SECRET}

### Includes and Excludes

<!-- language: lang-none -->
    package:
      include:
        - node_modules/**
      exclude:
        - package.json

### Declare functions

<!-- language: lang-none -->

    functions:
      payouts:
        handler: payouts.payoutsHandler
      balance:
        handler: balance.balanceHandler

## Invoke Locally

    serverless invoke local -f balance

    serverless invoke local -f payouts

## Deploy To Lambda

    serverless deploy -v

## Set API Gateway Trigger

From the AWS Lambda console:

    Navigate to the function > Triggers

    Add Triggers

    Choose API Gateway

    Note the URL for the function (copy it)

## Test in Postman

Create an environment in Postman:

[instructions](https://www.getpostman.com/docs/postman/environments_and_globals/manage_environments)

Add AWS_ACCESS_KEY and AWS_SECRET_ACCESS_KEY with corresponding values

Paste the function URL and select GET. Select the above created environment.

Under Authorization set:

    AccessKey to {{AWS_ACCESS_KEY_ID}}

    SecretKey to {{AWS_SECRET_ACCESS_KEY}}

Leave AWS Region and Service Name blank

Hit Send

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
