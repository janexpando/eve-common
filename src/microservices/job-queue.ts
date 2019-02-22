import {connection} from "mongoose";
import {Collection} from "mongodb";

export class JobQueue <T> {
    private collection: Collection<IJob<T>>;

    constructor(collectionName:string){
        this.collection = connection.collection(collectionName);
    }


    async add(job: T) {
        await this.collection.insertOne({
            createdOn: new Date(),
            completed: false,
            payload: job
        });
    }

    async take(): Promise<IJob<T>> {
        // @ts-ignore
        return await this.collection.findAndModify({
            query: {completed: false}
            , sort: {sort:{createdOn: -1}}
            , update: {completed:true}
            , new: true
        });
    }
}

export interface IJob<T> {
    createdOn: Date;
    completed: boolean;
    payload: T;
}


