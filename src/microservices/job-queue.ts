import {model, Schema, Document, Model} from "mongoose";

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

    async add(job: T) {
        await this.model.create({
            createdOn: new Date(),
            completed: false,
            version: this.getVersion(),
            payload: job
        });
    }

    async take(): Promise<IJob<T>> {
        return await this.model.findOneAndUpdate(
            {completed: false},
            {completed: true},
            {
                sort: {version: 1},
                new: true
            });
    }

    async clear() {
        return await this.model.remove({});
    }
}


export interface IJob<T> {
    createdOn: Date;
    completed: boolean;
    version: number;
    payload: T;
}

export interface Job<T> extends Document, IJob<T> {

}

const JOB_SCHEMA = new Schema({
    createdOn: {
        type: Date,
        required: true
    },
    version: {
        type: Number,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
    },
    payload: Schema.Types.Mixed
});

JOB_SCHEMA.statics.findAndModify = function (options) {
    return this.collection.findAndModify(options);
};


