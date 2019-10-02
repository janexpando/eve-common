import {ObjectId} from 'bson';
import {Injectable} from 'injection-js';
import {AmazonType} from "../models/marketplace-names";
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {IMwsCredentials} from "./product-pricing-client";

export interface ApiShipment {
    companyId: ObjectId;
    marketplace: AmazonType;
    marketplaceOrderId: string;
    shipmentId: string;
    shipmentItemId: string;
    sku: string;
    quantity: number;
    sellerCentralId: string;
    carrier: string;
    trackingNumber: string;
    billAddress: string;
    billCity: string;
    billState: string;
    billPostalCode: string;
    billCountry: string;
    currency: string;
    itemPromotionDiscount: number;
    shipPromotionDiscount: number;
    shipmentDate: Date;
    estimatedArrivalDate: Date;
}

@Injectable()
export class ShipmentClient extends EveClient {

    constructor(protected env: Environment) {
        super(env);
    }

    async downloadShipments(
        companyId: ObjectId,
        marketplace: AmazonType,
        credentials: IMwsCredentials,
        from: Date,
        to?: Date,
    ) {
        let body: any = {
            marketplace,
            credentials,
            from,
        };

        if (to)
            body.to = to;

        await this.got.post(`${this.env.ORDER_DOWNLOADER_URL}/company/${companyId}/shipments/download`, {
            body,
        });
    }

    async storeShipments(
        companyId: ObjectId,
        shipments: ApiShipment[],
    ) {
        await this.got.post(`/company/${companyId}/shipments`, {
            body: shipments,
        });
    }
}
