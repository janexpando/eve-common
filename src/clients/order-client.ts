import { ObjectId } from 'bson';
import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { AmazonType } from '..';
import { Environment } from '..';
import { ConsoleLogger } from '..';
import { Order } from '..';

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

    async storeOrders(companyId: ObjectId, orders: Order[]) {
        try {
            return await this.got.post(`${this.env.GATEWAY_URL}/company/${companyId}/orders`, {
                body: orders,
            });
        } catch (e) {
            this.logger.companyError(companyId, e);
            throw Error(`Orders with id: ${orders.map(order => order.marketplaceOrderId)} not received successfully.`);
        }
    }

    //TODO TEST
    async downloadOrders(
        companyId: ObjectId,
        marketplaces: AmazonType[],
        fromLastUpdate: Date,
        credentials: IMwsCredentials,
    ) {
        this.logger.json({
            companyId,
            marketplaces,
            fromLastUpdate,
            message: 'Requesting order downloader',
        });
        await this.got.post(`${this.env.ORDER_DOWNLOADER_URL}/company/${companyId}/orders/download`, {
            body: {
                marketplaces,
                fromLastUpdate,
                credentials,
                callback: `${this.env.GATEWAY_URL}/company/${companyId}/orders`,
            } as OrdersDownloadBody,
        });
    }
}
