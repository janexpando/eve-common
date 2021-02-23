import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';
import { MarketplaceName, OrderStatus } from '..';

export interface IEmagResponse {
    success: boolean;
    message?: string;
    error?: string;
}

@Injectable()
export class EmagServiceClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.EMAG_SERVICE_URL;
    }

    async setOrdersStatus(companyId: ObjectId, marketplace: MarketplaceName, orderId: number, status: OrderStatus): Promise<IEmagResponse> {
        if (status === OrderStatus.Shipped) {
            return await this.finalizeOrder(companyId, marketplace, orderId);
        } else {
            // TODO miky implement more when emag service ready
            return {
                success: false,
                message: 'Changing order status',
                error: `Unsupported status: "${status}"`,
            };
        }
    }

    private async finalizeOrder(companyId: ObjectId, marketplace: MarketplaceName, orderId: number): Promise<IEmagResponse> {
        const url = `/companies/${companyId}/orders/${orderId}/finalize`;
        let response;

        try {
            response = await this.got.patch(url, {
                body: {
                    marketplace,
                },
            });
        } catch (e) {
            return {
                success: false,
                message: `Finalize order ${orderId}`,
                error: e.message,
            };
        }

        return response.body;
    }
}
