export type SqsEvent<T> = {
    payload: T;
    context: Record<any, any>
}

export type Worker<T, U> = (event: T) => Promise<U>;

// SQSHandlerDecorator
// This is a decorator function that wraps a worker function to enabled it to handle SQS events
export function SQSHandlerDecorator <T, U>(worker: Worker<SqsEvent<T>, U>)  {
    return async (event, context) => {
        const { Records } = event;
        const promises = [] as Array<Promise<U>>;
        Records.forEach((record) => {
            /*
                transform event and provide context
                this can be a placed to add auth wrapping to you lambda handler
             */
            const { body } = record;
            const event = JSON.parse(body);
            const FormattedEvent = {
                payload: event,
                context: {}
            }
            const promise = worker(FormattedEvent).then((res) => {
                /*
                  implement logging here
                 */
                return res;
            }).catch((e) => {
                /*
                  implement logging here
                  ensure you are sending the failures to the DLQ
                 */
            })
            promises.push(promise);
        })
    }
}

// LambdaHandlerDecorator
// This is a decorator function that wraps a worker function to enabled it to handle Lambda events
export function LambdaHandlerDecorator <T, U>(worker: Worker<T, U>)  {
    return async (event, context) => {
        /*
             transform event and provide context
             this can be a placed to add auth wrapping to you lambda handler
          */
        const { body } = event;
        const parsed = JSON.parse(body);
        return worker(parsed).then((res) => {
            /*
              implement logging here
             */
            return res;
        }).catch((e) => {
            /*
              implement logging here
              ensure you are sending the failures to the DLQ
             */
        })
    }
}
