import type {Repository} from "./repository.ts";
import type { EventA, EventB, EventC} from "./types.ts";

export type DomainEvent<T> = {
    payload: T;
    context: any;
}


export class Service  {
    readonly Repo
    constructor(repo: Repository) {
        this.Repo = repo
    }

    async ProcessEventA(event: DomainEvent<EventA>): Promise<void> {
        console.log('Processing event', event);
        /*
          business logic
         */

        console.log('Event processed');
        return Promise.resolve();
    }


    async ProcessEventB(event: DomainEvent<EventB>): Promise<void> {
        console.log('Processing event', event);
        /*
          business logic
         */

        console.log('Event processed');
        return Promise.resolve();
    }

    async ProcessEventC(event: DomainEvent<EventC>): Promise<void> {
        console.log('Processing event', event);
        /*
          business logic
         */

        console.log('Event processed');
        return Promise.resolve();
    }
}