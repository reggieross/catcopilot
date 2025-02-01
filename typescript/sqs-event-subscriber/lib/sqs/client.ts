import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {Env} from "./env.ts";
import type {SQSClientConfig} from "@aws-sdk/client-sqs/dist-types/SQSClient";


const options ={
    credentials: {
        accessKeyId: Env.ACCESS_KEY_ID,
        secretAccessKey: Env.SECRET_ACCESS_KEY,
    },
    endpoint: Env.QUEUE_URL,
    region: Env.REGION
} as SQSClientConfig

const client = new SQSClient(options as any);

const _fetchSQSClient = () => {
    console.log(options)
    return client
}

const SendSQSMessage = async (message: Record<any, any>) => {
    const sqs = QueueClient._fetchSQSClient();
    const params = new SendMessageCommand({
        QueueUrl: Env.QUEUE_URL,
        MessageBody: JSON.stringify(message)
    });

    return sqs.send(params as any);
}

export const QueueClient = {
    SendSQSMessage,
    _fetchSQSClient
}