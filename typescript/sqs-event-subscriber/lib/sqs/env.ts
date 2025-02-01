export const Env = {
    OFFLINE: process.env.IS_OFFLINE === 'true',
    REGION: process.env.REGION || 'us-east-1',
    QUEUE_URL: 'http://0.0.0.0:9324/EventSubscriber-dev',
    TOPIC_ARN: process.env.TOPIC_ARN || '',
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'doesnt_matter',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'doesnt_matter',
}