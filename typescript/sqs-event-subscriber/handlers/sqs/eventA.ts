import {FetchDynamoClient} from "../../lib/dynamo";
import {SQSHandlerDecorator} from "../../lib/decorators";
import {EventA, EventB, Repository, Service} from "../../lib/domain";


export default {
    async handler (event, context)  {
        const client = FetchDynamoClient();
        const repo = new Repository(client)
        const service = new Service(repo)
        return await SQSHandlerDecorator<EventA>(service.ProcessEventA)(event, context)
    }
};