import {ObjectId} from 'bson';
import {EveClient} from "./eve-client";
import {Environment} from "../bootstrapping/environment";
import {Dict} from "../types";
import {MarketplaceName} from "../models/marketplace-names";
import {Injectable} from "injection-js";

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

export interface ApiSyncSettings {
    companyId: ObjectId;
    synchronizePrices: boolean;
    synchronizeStock: boolean;
    listNewProducts: boolean;
    zeroUnmatchedProducts: boolean;
    downloadPricing: boolean;
    formulas: Dict<ApiFormula, MarketplaceName>;
    autopricing: Dict<boolean, MarketplaceName>;
}

export interface ApiFormula {
    add: number;
    multiply: number;
}
