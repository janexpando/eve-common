import { ObjectId } from 'bson';
import { ApiCarrierName, MarketplaceName, MarketplaceType, ServiceName } from '..';

interface ApiDeliveryMethodsMapping {
    marketplace: MarketplaceName;
    method: string;
    serviceMethod: string;
}
interface ApiPaymentMethodsMapping {
    method: 'online' | 'onCashDelivery';
    serviceMethod: string;
}
export interface ApiImportSettings {
    companyId: ObjectId;
    marketplaceType: MarketplaceType;
    service: ServiceName;
    defaultOrderStatus?: string;
    importOrderJustOnce?: boolean;
    lowerStockOnOrder?: boolean;
    synchronizeOrders?: boolean;
    shipmentMethod?: string;
    synchronizeFbaOrders?: boolean;
    carrier?: ApiCarrierName;
    carrierName?: string;
    deliveryMethodsMapping?: ApiDeliveryMethodsMapping[];
    autoconfirmOrderOnStatus?: string;
    paymentMethodsMapping?: ApiPaymentMethodsMapping[];
}
