import * as mongoose from 'mongoose';
import { DbDriver } from '..';
import { TestInterface } from 'ava';
import { InjectorContext } from './injector';

async function truncateCollections() {
    let config = await mongoose.connection.db.collection('dbconfig').findOne({});
    if (config && config.production) {
        throw new Error(
            'You are trying to run unit tests on production you dumb fuck. This could erase whole database.',
        );
    }
    for (let modelName of mongoose.modelNames()) {
        await mongoose.models[modelName].deleteMany({});
    }
}

export const prepareDB = (test: TestInterface<InjectorContext>) => {
    test.before(async t => {
        await t.context.injector.get(DbDriver).connect();
    });

    test.beforeEach(async () => {
        // await mongoose.connection.db.dropDatabase();
        await truncateCollections();
        // await runMigrations();
    });

    test.after.always(async t => {
        await t.context.injector.get(DbDriver).disconnect();
    });
};
