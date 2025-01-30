import { FetchClient } from "../../app/lib/dynamo";
import {Repository, Service} from "../../app/domain";
import {SQSHandlerDecorator} from "../../app";
import type {EventB} from "../../app/domain";

const handler = async (event, context): Promise<void> => {
    const client = FetchClient();
    const repo = new Repository(client)
    const service = new Service(repo)
    await SQSHandlerDecorator<EventB, void>(service.ProcessEventB)(event, context)
}