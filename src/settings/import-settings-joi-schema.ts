import { array, bool, object, string } from 'joi';
import { MARKETPLACE_TYPES, MARKETPLACES, optionalString, SERVICE_NAMES } from '..';

const optionalBool = () =>
    bool()
        .allow(null)
        .optional();

export const IMPORT_SETTINGS_JOI_SCHEMA = object({
    companyId: string().required(),
    marketplaceType: string().allow(MARKETPLACE_TYPES),
    service: string().allow(SERVICE_NAMES),
    defaultOrderStatus: optionalString(),
    importOrderJustOnce: optionalBool(),
    lowerStockOnOrder: optionalBool(),
    synchronizeOrders: optionalBool(),
    shipmentMethod: optionalString(),
    synchronizeFbaOrders: optionalBool(),
    carrier: optionalString(),
    carrierName: optionalString(),
    deliveryMethodsMapping: array()
        .items(
            object({
                marketplace: string().allow(MARKETPLACES),
                method: string(),
                serviceMethod: string(),
            }),
        )
        .allow(null),
    autoconfirmOrderOnStatus: optionalString(),
});
