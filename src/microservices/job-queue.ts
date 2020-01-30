import { model, Schema, Document, Model } from 'mongoose';
import { ObjectId } from 'bson';

export class JobQueue<T> {
    private lastUsedTick: number = 0;

    public readonly model: Model<Job<T>>;

    constructor(collectionName: string) {
        this.model = model<Job<T>>(collectionName, JOB_SCHEMA);
    }

    private getVersion(): number {
        let now = Date.now();
        if (now > this.lastUsedTick) {
            this.lastUsedTick = now;
        } else {
            this.lastUsedTick++;
        }
        return this.lastUsedTick;
    }

    async add(payload: T): Promise<Job<T>> {
        return await this.model.create({
            createdOn: new Date(),
            received: false,
            version: this.getVersion(),
            payload,
            finishedOn: null,
            startedOn: null,
            timeoutOn: null,
        } as IJob<T>);
    }

    async take(processTime: number): Promise<Job<T>> {
        let now = new Date();
        let timeoutOn = new Date(now.getTime() + processTime);
        return await this.model.findOneAndUpdate(
            { received: false },
            {
                received: true,
                startedOn: now,
                timeoutOn,
            },
            {
                sort: { version: 1 },
                new: true,
            },
        );
    }

    async markFinished(_id: ObjectId) {
        await this.model.updateOne(
            { _id },
            {
                finishedOn: new Date(),
            },
        );
    }

    async get(_id: ObjectId): Promise<IJob<T>> {
        return await this.model.findById(_id);
    }

    async clear() {
        return await this.model.remove({});
    }

    async waitingJobsCount(): Promise<number> {
        return await this.model.count({ received: false });
    }
}

export interface IJob<T> {
    createdOn: Date;
    received: boolean;
    version: number;
    payload: T;
    startedOn: Date;
    timeoutOn: Date;
    finishedOn: Date;
}

export type JobState = 'queued' | 'processing' | 'timeout' | 'finished';

export function getJobState(job: IJob<any>): JobState {
    if (!job.received) {
        return 'queued';
    }
    if (job.finishedOn) {
        return 'finished';
    }
    let now = Date.now();
    if (job.timeoutOn.getTime() < now) {
        return 'timeout';
    }
    return 'processing';
}

export interface Job<T> extends Document, IJob<T> {}

const JOB_SCHEMA = new Schema({
    createdOn: {
        type: Date,
        required: true,
    },
    version: {
        type: Number,
        required: true,
    },
    received: {
        type: Boolean,
        required: true,
    },
    startedOn: {
        type: Date,
        default: null,
    },
    timeoutOn: {
        type: Date,
        default: null,
    },
    finishedOn: {
        type: Date,
        default: null,
    },
    payload: Schema.Types.Mixed,
});
