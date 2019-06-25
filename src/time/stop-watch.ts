export class StopWatch {
    private startTime: number;
    private total: number;

    start() {
        if (this.startTime) throw new Error('cannot start timing again');
        this.startTime = Date.now();
    }

    stop(): number {
        if (!this.startTime) return null;
        this.total = (Date.now() - this.startTime);
        this.startTime = null;
        return this.total;
    }

    elapsed(): string {
        return `${this.total} ms`;
    }

    static start(): StopWatch {
        let watch = new StopWatch();
        watch.start();
        return watch;
    }
}
