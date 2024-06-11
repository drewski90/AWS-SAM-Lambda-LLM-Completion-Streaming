# OpenAI Chat Completion with Lambda Function URL

This AWS SAM template sets up a Lambda function that generates chat completions using OpenAI's API. The Lambda function is exposed via a function URL which supports streaming responses.
Prerequisites

    AWS CLI configured with appropriate permissions
    AWS SAM CLI installed
    OpenAI API Key

### Note: This was a test to see whether serverless http requests are a decent alternative to using an API gateway websocket.

# Architecture

This template creates a Lambda function with a function URL. It is important to note that streaming from Lambda will only work if you use a function URL. Using the Lambda function as an HTTP proxy behind AWS API Gateway will not work for streaming responses because streamed responses are not supported by API Gateway in this context.
Resources Created

    Lambda Function: Handles requests for chat completions using OpenAI's API.
    Lambda Function URL: Exposes the Lambda function with a URL that supports streaming responses.

# Pros and Cons
Using Lambda Function URL

### Pros:

    Streaming Support: The function URL supports streaming responses, which is essential for streaming openai responses by the token.
    Simplicity: Easier to set up and manage compared to more complex architectures involving API Gateway.
    Cost-Effective: Reduces costs associated with API Gateway usage.

### Cons:

    Limited Features: Function URLs are less feature-rich compared to API Gateway. They lack advanced routing, request validation, and other features provided by API Gateway.
    Security: Requires careful management of IAM policies to ensure secure access.

## Using API Gateway WebSocket

### Pros:

    Feature-Rich: API Gateway WebSocket offers more advanced features like routing, request validation, and integration with other AWS services.
    Real-Time Communication: Ideal for applications that require bidirectional communication, such as real-time chat applications.

### Cons:

    No Streaming Support: API Gateway WebSocket does not support streaming responses, which is a limitation for applications needing real-time data from Lambda functions.
    Complexity: More complex to set up and manage compared to using function URLs.
    Cost: Potentially higher costs due to additional API Gateway charges.

# Deployment

```bash
sam build
sam deploy --guided
```

# Testing

Open index.html in your browser and enter the lambda function's url, enter a prompt and hit submit.
