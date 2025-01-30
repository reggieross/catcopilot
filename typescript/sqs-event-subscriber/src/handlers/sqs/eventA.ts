import { FetchClient } from "../../app/lib/dynamo";
import {Repository, Service} from "../../app/domain";
import {SQSHandlerDecorator} from "../../app";
import type {EventA} from "../../app/domain";

 const handler = async (event, context): Promise<void> => {
    const client = FetchClient();
    const repo = new Repository(client)
    const service = new Service(repo)
    await SQSHandlerDecorator<EventA, void>(service.ProcessEventA)(event, context)
}