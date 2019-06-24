import { Injectable } from 'injection-js';

@Injectable()
export class LogicalClock {
    private version: number = Date.now();

    getVersion(): number {
        const now = Date.now();
        if (now > this.version) {
            this.version = now;
        }
        const result = this.version;
        this.version++;
        return result;
    }

    getDate(): Date {
        return new Date(this.getVersion());
    }
}
