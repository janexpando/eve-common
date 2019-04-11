import {provideInjector} from "../injector";
import {test} from "../global-ava";
import {prepareDB} from "../prepare-db";
import {model, Schema} from "mongoose";

provideInjector(test);
prepareDB(test);

test.serial("create record in db", async t => {
    let Test = model<any>('Test', new Schema<any>({name: String}));
    await Test.create({name: 'SUCCESS'});
    let found = await Test.findOne({name: 'SUCCESS'});
    t.is(found.name, 'SUCCESS');
});
