# SQS Event Subscriber (TypeScript)

## 1. Overview
This repository provides a base project for consuming events from AWS SQS in a Serverless environment. For example, you might use it to forward Stripe billing events to other services (like an identity domain) or trigger customer communications. The core idea is to provide a robust, modular foundation that you can customize to handle various event types.

### Key Features
- **Serverless Framework** setup with AWS as the provider
- **CloudFormation** templates (separate files for clarity)
- **Bun** usage for building and deployment
- **TS project structure** for modular and re-usable services
- **SQS-specific best practices** (partial batch failures, concurrency, etc.)

## 2. Architecture & Flow
A high-level overview of how events flow:
1. **Webhook Producer**: Events (like `customer.created`) get pushed to SQS (or another event source).
2. **SQS Queue**: Holds messages until they are processed.
3. **Lambda Subscriber**: Subscribes to SQS. When messages arrive, they trigger the Lambda.
4. **Handlers**: Lambda entry points that parse the event, delegate to the appropriate service, and handle the response.
5. **Services (in `app/`)**: The actual business logic (e.g., updating billing status, sending emails, etc.).

Webhook --> SQS --> Lambda Handler --> Services (app/) --> Downstream Systems


### `handlers/` Handlers
- **Keep them slim**. Handlers parse the raw event input and delegate to the appropriate service within `app/`.
- This separation makes testing and maintenance easier.
- group them by source system (e.g., sqs, sns, step-functions, etc.).

### `app/` Folder
- Houses **business logic** and **domain-level services**.
- Encourages modularity; aim for **single-responsibility** and re-usable functions and classes.

### `cf/` Folder
- Contains **CloudFormation templates** for provisioning resources (SQS queues, dead-letter queues, IAM roles, etc.).
- Referenced by the root [serverless.yml](./serverless.yml), making it easier to break down large configurations into smaller templates.

## 4. Getting Started

### Prerequisites
- **Node.js / Bun** installed
- **Serverless Framework** installed globally (`npm install -g serverless`) or locally in the project
- **AWS credentials** configured

### 4.1 Installation
```bash
# If you haven't installed Bun
curl -fsSL https://bun.sh/install | bash

# In the project directory
bun install
```

### 4.2  Building the Project
```bash
bun run build
```
Compiles the TypeScript code to JavaScript and outputs the artifacts to a build directory (e.g., build/).

### 4.3 Deploying to AWS
You can deploy to a specific stage (e.g., dev, staging, prod) using: bun run deploy:{stage}:

```bash
bun run deploy:dev
```

## 5. Local Development & Testing

> **Note**: SQS local testing has some limitations. We’re using a Bun layer that expects all events to come in with a specific format.

### Running Locally with Serverless
Since we cannot easily pull messages from a local SQS emulator (like LocalStack or ElasticMQ) in this setup, we use AWS SQS directly. To test locally:

1. Create a sample event file (e.g., `mocks/event.json`).
2. Invoke the function locally:
   ```bash
   FUNCTION_NAME=eventA-consumer
   EVENT_FILE=mocks/event.json

   bunx serverless invoke local \
     --function "$FUNCTION_NAME" \
     --path "$EVENT_FILE"
    ```
3. Event Payload Expectation:
4. 
    ```json
    {
       "body": {
          "Records": [
             {
                "body": "{\"id\":\"evt_12345\",\"object\":\"event\"}"
             }
          ]
       }
   }
    ```

## 6. SQS Gotchas & Remedies

### 6.1 Partial Batch Failures
- **Use a DLQ (Dead-Letter Queue)**: Prevent infinite retry loops (“snowball anti-pattern”) by configuring a DLQ.
- **ReportBatchItemFailures**: In your Lambda event source mapping, include `ReportBatchItemFailures` to handle only the failed messages.
- **Max Receive Count**: Set `maxReceiveCount` on the source queue’s RedrivePolicy to define how many times a message can be retried before moving to the DLQ.
- **Idempotent Handlers**: Write your handler logic to be safe if it processes the same message multiple times.
- **FIFO Consideration**: If using FIFO queues, ensure you return failed and unprocessed messages in `batchItemFailures` to preserve message order.

### 6.2 Concurrency Limits
- Use **visibility timeouts** generously. If a Lambda function’s concurrency is throttled or if the function is busy, the message should remain hidden until it’s processed or the timeout expires.

## 7. Contributing (Optional)
If this is an internal project, outline your guidelines here:
- **Pull requests**: How to open a PR, required reviews, etc.
- **Coding standards**: Linting, testing, etc.
- **Versioning**: How you bump versions or handle environment-specific changes.

## 8. Additional Resources
- [AWS Documentation: SQS](https://docs.aws.amazon.com/sqs/)
- [AWS Documentation: Lambda with SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)

---
