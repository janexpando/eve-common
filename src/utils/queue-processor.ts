export class QueueProcessor<T> {
    private queue: T[] = [];
    private runningJobs: { done: boolean; promise: Promise<any> }[] = [];
    private concurrent: number = 1;
    private waiting: number = 0;
    private handleResult: (r: any, i: T) => void = () => {};
    private handleError: (e: any, i: T) => void = () => {};

    constructor(
        private processFn: (queueItem: T) => any,
        options?: {
            handleResult?: (r: any, i: T) => void;
            handleError?: (e: any, i: T) => void;
            concurrency?: number;
        },
    ) {
        if (options) {
            if (options.handleResult) this.handleResult = options.handleResult;
            if (options.handleError) this.handleError = options.handleError;
            if (options.concurrency) this.concurrent = options.concurrency;
        }
    }

    /**
     * Add item to a FIFO queue - will be processed when available
     */
    addToQueue(item: T) {
        if (this.canRunProcess) this.runProcess(item);
        else this.queue.push(item);
    }

    /**
     * Add item to be processed as soon as possible skipping ahead of queue.
     * This action will not exceed the concurrency limit.
     */
    async addRunning(item: T) {
        this.waiting++;
        while (!this.canRunProcess) await Promise.race(this.currentPromises);
        this.waiting--;
        this.runProcess(item);
    }

    /**
     * Set the amount of concurrent jobs.
     * This action will automatically run new jobs if possible.
     */
    set concurrency(concurrency: number) {
        this.concurrent = concurrency;
        this.runAvailable();
    }

    /**
     * Get the amount of concurrent jobs.
     */
    get concurrency(): number {
        return this.concurrent;
    }

    /**
     * Awaitable call to make sure queue has been depleted and all running jobs have finished
     */
    async finish(): Promise<void> {
        while (this.running) await Promise.race(this.currentPromises);
    }

    /**
     * Number of currently running jobs
     */
    get running(): number {
        return this.runningJobs.length;
    }

    /**
     * Number of item in the queue
     */
    get enqueued(): number {
        return this.queue.length;
    }

    private get currentPromises() {
        return this.runningJobs.map(x => x.promise);
    }

    private get canRunProcess(): boolean {
        return this.running < this.concurrent;
    }

    private runProcess(item: T) {
        let runningJob = {
            done: false,
            promise: null,
        };
        this.runningJobs.push(runningJob);
        runningJob.promise = this.processFn(item)
            .then(r => this.handleResult(r, item))
            .catch(e => this.handleError(e, item))
            .finally(() => {
                runningJob.done = true;
                this.runningJobs = this.runningJobs.filter(x => !x.done);
                this.runAvailable();
            });
    }

    private runAvailable() {
        if (this.enqueued && this.waiting === 0)
            while (this.concurrent - this.running > 0) this.runProcess(this.queue.shift());
    }
}
