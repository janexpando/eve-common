export class QueueProcessor<T> {
    queue: T[] = [];
    running: { done: boolean; promise: Promise<any> }[] = [];
    concurrency: number = 1;
    process: Promise<void> = null;

    private processResult: (r: any) => void = null;
    private reportError: (e: any) => void = null;

    constructor(
        private processFn: (queueItem: T) => Promise<void>,
        options?: { processResult?: (a: any) => void; reportError?: (e: any) => void; concurrency?: number },
    ) {
        if (options.processResult) this.processResult = options.processResult;
        if (options.reportError) this.reportError = options.reportError;
        if (options.concurrency) this.concurrency = options.concurrency;
    }
    get currentPromises() {
        return this.running.map(x => x.promise);
    }
    finish(): Promise<void> {
        return this.process;
    }
    addToQueue(item: T) {
        this.queue.push(item);
        if (!this.process) this.process = this.run();
    }
    async addRunning(item: T) {
        while (this.running.length >= this.concurrency) await Promise.race(this.currentPromises);
        let runningItem = {
            done: false,
            promise: null,
        };
        runningItem.promise = this.processFn(item)
            .then(this.processResult)
            .catch(this.reportError)
            .finally(() => {
                runningItem.done = true;
                this.running = this.running.filter(x => !x.done);
            });
        this.running.push(runningItem);
        if (!this.process) this.process = this.run();
    }

    private async run() {
        while (this.queue.length || this.running.length) {
            if (this.queue.length) await this.addRunning(this.queue.shift());
            if (this.queue.length === 0) await Promise.all(this.currentPromises);
        }
        this.process = null;
    }
}


/*
// Example:

    const processor: QueueProcessor<number> = new QueueProcessor<number>(
        async n => {
            console.log('start', n);
            await sleep(n);
            console.log('finish', n);
        },
        { concurrency: 5 },
    );

    for (let i = 0; i < 10; i++) {
        processor.addToQueue(i * 10);
        console.log('queue', processor.queue.length,', running', processor.running.length);
    }
    await processor.finish();

    console.log('queue', processor.queue.length,', running', processor.running.length);
    console.log('-----------------------');

    for (let i = 0; i < 10; i++) {
        await processor.addRunning(i * 10);
        console.log('queue', processor.queue.length,', running', processor.running.length);
    }
    await processor.finish();

 */