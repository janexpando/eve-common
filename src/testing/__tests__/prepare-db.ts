import {provideInjector} from "../injector";
import {test} from "../global-ava";
import {prepareDB} from "../prepare-db";
import {model, Schema} from "mongoose";

let Test = model<any>('Test', new Schema<any>({name: String}));

provideInjector(test);
prepareDB(test);

test.serial("create record in db", async t => {
    await Test.create({name: 'SUCCESS'});
    let found = await Test.find({});
    t.is(found.length, 1);
    t.is(found[0].name, 'SUCCESS');
});
