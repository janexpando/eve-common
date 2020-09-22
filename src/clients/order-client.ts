import { ObjectId } from 'bson';
import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { AmazonType, ApiOrder, MarketplaceName } from '..';
import { Environment } from '..';
import { ConsoleLogger } from '..';

interface IMwsCredentials {
    accessKey: string;
    secretKey: string;
    sellerId: string;
    token: string;
}

interface OrdersDownloadBody {
    credentials: IMwsCredentials;
    callback: string;
    marketplaces: AmazonType[];
    fromLastUpdate: Date;
}

@Injectable()
export class OrderClient extends EveClient {
    constructor(protected env: Environment, private logger: ConsoleLogger) {
        super(env);
    }

    async storeOrders(companyId: ObjectId, orders: ApiOrder[]) {
        try {
            return await this.got.post(`${this.env.GATEWAY_URL}/company/${companyId}/orders`, {
                body: orders,
            });
        } catch (e) {
            this.logger.companyError(companyId, e);
            throw e;
        }
    }

    //TODO TEST
    async downloadOrders(
        companyId: ObjectId,
        marketplaces: AmazonType[],
        fromLastUpdate: Date,
        toLastUpdate: Date,
        credentials: IMwsCredentials,
    ) {
        this.logger.json({
            companyId,
            marketplaces,
            fromLastUpdate,
            toLastUpdate,
            message: 'Requesting order downloader',
        });
        await this.got.post(`${this.env.ORDER_DOWNLOADER_URL}/company/${companyId}/orders/download`, {
            body: {
                marketplaces,
                fromLastUpdate,
                toLastUpdate,
                credentials,
                callback: `${this.env.GATEWAY_URL}/company/${companyId}/orders`,
            } as OrdersDownloadBody,
        });
    }

    async getOrdersByFulfillmentId(fulfillmentId: string) {
        return await this.got.get(`${this.env.GATEWAY_URL}/orders?fulfillment=${fulfillmentId}`)
    }

    async getOrder(companyId: ObjectId, marketplace: MarketplaceName, marketplaceOrderId: string): Promise<ApiOrder> {
        try {
            const response = await this.got.get(
                `${this.env.GATEWAY_URL}/company/${companyId}/marketplace/${marketplace}/marketplaceOrderId/${marketplaceOrderId}/order`,
            );
            return response.body;
        } catch (e) {
            this.logger.companyError(companyId, e);
            throw e;
        }
    }
}
