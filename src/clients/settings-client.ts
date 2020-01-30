import { ObjectId } from 'bson';
import { EveClient } from './eve-client';
import { Environment } from '../bootstrapping/environment';
import { Dict } from '../types';
import { MarketplaceName } from '../models/marketplace-names';
import { Injectable } from 'injection-js';

@Injectable()
export class SettingsClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async getOrCreate(companyId: ObjectId): Promise<ApiSyncSettings> {
        let response = await this.got.get(`/company/${companyId}/settings`);
        let settings = response.body;
        settings.companyId = new ObjectId(settings.companyId);
        return settings;
    }
}

export interface ApiAutopricingSettings {
    active: boolean;
    autoActivation: boolean;
    progressStrategy: number;
    fallbackStrategy: number;
    penaltyDrain: number;
    amplification: number;
    countInShipping: boolean;
    defaultTopCap: number;
    defaultBottomCap: number;
}

export type ApiCarrierName =
    | 'AFLFedex'
    | 'Aramex'
    | 'BluePackage'
    | 'BlueDart'
    | 'CanadaPost'
    | 'Chronopost'
    | 'CityLink'
    | 'DHL'
    | 'DHLGlobalMail'
    | 'DPD'
    | 'DTDC'
    | 'Delhivery'
    | 'DeutschePost'
    | 'FEDEXJP'
    | 'Fastway'
    | 'FedEx'
    | 'FedExSmartPost'
    | 'FirstFlight'
    | 'GLS'
    | 'GO'
    | 'HermesLogistikGruppe'
    | 'IndiaPost'
    | 'JPEXPRESS'
    | 'LaPoste'
    | 'Lasership'
    | 'NITTSU'
    | 'Newgistics'
    | 'NipponExpress'
    | 'OSM'
    | 'OnTrac'
    | 'OverniteExpress'
    | 'Parcelforce'
    | 'Parcelnet'
    | 'PosteItaliane'
    | 'Professional'
    | 'RoyalMail'
    | 'SAGAWA'
    | 'SDA'
    | 'SagawaExpress'
    | 'Smartmail'
    | 'Streamlite'
    | 'TNT'
    | 'Target'
    | 'UPS'
    | 'UPSMI'
    | 'UPSMailInnovations'
    | 'USPS'
    | 'YAMATO'
    | 'YamatoTransport'
    | 'Other';

export interface ApiMallSettings {
    synchronizePrices: boolean;
    synchronizeStock: boolean;
}

export interface ApiAmazonSettings {
    synchronizePrices: boolean;
    synchronizeStock: boolean;
    listNewProducts: boolean;
    downloadPricing: boolean;
    zeroUnmatchedProducts: boolean;
}

export interface ApiSyncSettings {
    companyId: ObjectId;
    formulas: Dict<ApiFormula, MarketplaceName>;
    japoId: string;
    autopricing?: Dict<ApiAutopricingSettings, MarketplaceName>;
    mall?: ApiMallSettings;
    amazon?: ApiAmazonSettings;
}

export interface ApiFormula {
    add: number;
    multiply: number;
}
