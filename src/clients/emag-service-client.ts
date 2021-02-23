import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';
import { ConsoleLogger, MarketplaceName, OrderStatus } from '..';

@Injectable()
export class EmagServiceClient extends EveClient {
    constructor(protected env: Environment, private logger: ConsoleLogger) {
        super(env);
        this.baseUrl = this.env.EMAG_SERVICE_URL;
    }

    async setOrdersStatus(companyId: ObjectId, marketplace: MarketplaceName, orderId: number, status: OrderStatus) {
        if (status === OrderStatus.Shipped) {
            return await this.finalizeOrder(companyId, marketplace, orderId);
        } else {
            // TODO miky implement more when emag service ready
            throw `Unsupported status change to ${status}`;
        }
    }

    private async finalizeOrder(companyId: ObjectId, marketplace: MarketplaceName, orderId: number) {
        const url = `/companies/${companyId}/orders/${orderId}/finalize`;
        let response = await this.got.patch(url, {
            body: {
                marketplace,
            },
        });

        if (response.statusCode !== 200) {
            const errorString = `${response.body.message}: ${response.body.error}`;
            this.logger.companyError(companyId, errorString);
            throw errorString;
        }

        return response.body;
    }
}
