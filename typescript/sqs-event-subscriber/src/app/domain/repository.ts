export class Repository {
    readonly dynamoClient
    constructor(client) {
        this.dynamoClient = client
    }


    async fetch() {
        console.log("Fetching Data")
        return Promise.resolve()
    }
}