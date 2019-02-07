import {ObjectId} from "bson";
import {MarketplaceName} from "../../marketplace-names";
import {OrderStatus} from "./order-status";
import {CurrencyCode} from "../../currency";
import {IOrderItem} from "./order-item";
import {IAddress} from "../../address";

export type FulfilmentChannel = 'FBA' | 'Seller';

export type PaymentMethod = string;

export interface IOrder {
    companyId: ObjectId;
    marketplaceOrderId: string,
    status: OrderStatus;
    marketplace: MarketplaceName;
    fulfillmentChannel: FulfilmentChannel;
    totalPrice: number;
    currencyCode: CurrencyCode;
    paymentMethod: PaymentMethod;
    shipServiceLevel: string;

    buyer: IAddress;
    items: IOrderItem[];
    lastChanged: Date;
    purchaseDate: Date;
}
