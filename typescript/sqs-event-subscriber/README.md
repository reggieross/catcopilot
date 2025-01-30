# Event Consumer TS


## About

This is a base level project for a serverless event consumer. It is setup using bun

### Setup 



## Gotcha's SQS

1. When thinking about batches of events if one record fails to be processed then the entire batch will fail. To 
circumvent this we are using a lib called middy. Middy is a middleware lib that will handle deleting events from a Queue
and ensure once an event is process it won't be processed again
2. Since we are using lambdas it's possible that more than one lambda can be spun up at once to try and handle and event. To circumvent
this we are doing 2 things. Adding visibility timeouts to our sqs message which should ensure that an event is hodden while it's being processed
and stringifying the event and placing it in a dyanmo db table. Before we try and process that event we
will check to see if someone else already tried to process it.
