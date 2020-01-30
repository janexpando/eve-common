import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { DbDriver } from '..';

@Injectable()
export class Thanos {
    constructor(private db: DbDriver) {}

    async snap(companyId: ObjectId, isGateway: boolean = false) {
        let collection = name => this.db.db.db.collection(name);
        let collectionNames = (await this.db.db.db.listCollections().toArray()).map(x => x.name);
        for (let collectionName of collectionNames) {
            if (!isGateway || !['companies', 'users'].includes(collectionName))
                await collection(collectionName).deleteMany({ companyId });
        }
        if (isGateway) {
            let users = await collection('users')
                .find({ 'roles.companyId': companyId })
                .toArray();
            for (let user of users) {
                if (user.roles.length == 1) {
                    await collection('users').deleteOne({ _id: user._id });
                } else {
                    let newRoles = user.roles.filter(x => x.companyId.toHexString() != companyId.toHexString());
                    await collection('users').updateOne({ _id: user._id }, { $set: { roles: newRoles } });
                }
            }
            await collection('companies').deleteOne({ _id: companyId });
        }
    }
}
