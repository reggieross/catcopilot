export type SqsEvent<T> = {
    payload: T;
    context: Record<any, any>
}

export type Worker<T> = (event: T) => Promise<void>;

export type SQSHandler = (message, context) => Promise<Response>

export type SQSMessage = {
    messageId: string
    receiptHandle: string,
    body: string,
    attributes: Record<string, any>,
    messageAttributes: {},
    md5OfBody:string,
    eventSource: string,
    eventSourceARN: string,
    awsRegion: string,
}

// SQSHandlerDecorator
// This is a decorator function that wraps a worker function to enabled it to handle SQS events
export function SQSHandlerDecorator <T>(
    worker: Worker<SqsEvent<T>>,
): SQSHandler {
    return async (request: Request, context) => {
        const payload = await request.json();
        const { event } = payload;
        if (!event) {
            return new Response('No event found', {status: 400})
        }

        const records= (event.Records as SQSMessage[]) ?? [];
        const promises =  records.map((record) => {
            /*
                transform event and provide context
                this can be a placed to add auth wrapping to you lambda handler
             */
            const { body } = record;
            return worker({
                payload: JSON.parse(body) as T,
                context: {}
            }).then((res) => {
                /*
                 implement more logging here
                */
                console.log('Event processed successfully');
            }).catch((e) => {
                /*
                  implement logging here
                  ensure you are sending the failures to the DLQ
                 */
            })
        })
        await Promise.allSettled(promises)
        return new Response()
    }
}