import { ObjectId } from 'bson';
import { Injectable } from 'injection-js';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';

export interface ApiPickupListInput {
    companyId: ObjectId;
    carrier: string;
    pickupListPdf: string;
    pickupListGroupPdf: string;
    carrierPickupListGroupId: number;
    pickupTime?: Date;
    orderIds: ObjectId[];
}

@Injectable()
export class PickupListClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.GATEWAY_URL;
    }

    async updateList(carrierPickupListId: number, list: ApiPickupListInput): Promise<{ carrierPickupListId: number }> {
        const response = await this.got.patch(`/pickup-lists/${carrierPickupListId}`, {
            body: { ...list },
        });

        return response.body;
    }
}
