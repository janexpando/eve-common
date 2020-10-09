export class QueueProcessor<T> {
    queue: T[] = [];
    running: { done: boolean; promise: Promise<any> }[] = [];
    concurrency: number = 1; // TODO execute processes when increasing concurrency during execution
    process: Promise<void> = null;

    private handleResult: (r: any) => void = null;
    private handleError: (e: any) => void = () => {};

    constructor(
        private processFn: (queueItem: T) => any,
        options?: { handleResult?: (a: any) => void; handleError?: (e: any) => void; concurrency?: number },
    ) {
        if (options.handleResult) this.handleResult = options.handleResult;
        if (options.handleError) this.handleError = options.handleError;
        if (options.concurrency) this.concurrency = options.concurrency;
    }

    finish(): Promise<void> {
        return this.process;
    }

    addToQueue(item: T) {
        if (this.canRunProcess) this.runProcess(item);
        else this.queue.push(item);
    }

    async addRunning(item: T) {
        while (!this.canRunProcess) await Promise.race(this.currentPromises);
        this.runProcess(item);
    }

    private get currentPromises() {
        return this.running.map(x => x.promise);
    }

    private get canRunProcess() {
        return this.running.length < this.concurrency;
    }

    private async run() {
        while (this.queue.length || this.running.length) {
            if (this.queue.length) await this.addRunning(this.queue.shift());
            if (this.queue.length === 0) await Promise.race(this.currentPromises);
        }
        this.process = null;
    }

    private runProcess(item: T) {
        let runningItem = {
            done: false,
            promise: null,
        };
        runningItem.promise = this.processFn(item)
            .then(this.handleResult)
            .catch(this.handleError)
            .finally(() => {
                runningItem.done = true;
                this.running = this.running.filter(x => !x.done);
            });
        this.running.push(runningItem);
        if (!this.process) this.process = this.run();
    }
}
