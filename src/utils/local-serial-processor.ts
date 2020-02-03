export class LocalSerialProcessor<T> {
    queue: T[];
    constructor(private processFn: (queueItem: T) => Promise<any>, private errorReportFn: (e: any) => void) {
        this.queue = [];
    }
    add(item: T) {
        this.queue.push(item);
        this.run().then();
    }
    private async run() {
        if (this.queue.length > 1) return;
        while (this.queue.length > 0) {
            let item = this.queue[0];
            try {
                await this.processFn(item);
            } catch (e) {
                this.errorReportFn(e);
            } finally {
                this.queue.shift();
            }
        }
    }
}
