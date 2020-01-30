import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { MwsCredentialsClient } from '../clients/mws-credentials-client';
import { AmazonType, MarketplaceName } from '../models/marketplace-names';
import { DeveloperConfigClient } from '../clients/developer-config-client';
import { MwsCreator, MwsState } from './mws-creator';

export class CredentialsNotFound extends Error {
    constructor(companyId: ObjectId, marketplace: MarketplaceName) {
        super(`Credentials not found for ${companyId} ${marketplace}`);
    }
}

@Injectable()
export class MwsProvider {
    constructor(
        private credentialsKeeper: MwsCredentialsClient,
        private mwsConfigKeeper: DeveloperConfigClient,
        private mwsCreator: MwsCreator,
    ) {}

    async getMws(companyId: ObjectId, marketplace: AmazonType): Promise<MwsState> {
        let credentials = await this.credentialsKeeper.getCredentials(companyId, marketplace);
        if (!credentials) throw new CredentialsNotFound(companyId, marketplace);
        const { developerId, token, sellerId } = credentials;
        let mwsConfig = await this.mwsConfigKeeper.getMwsConfig(developerId);

        if (!mwsConfig) throw new Error('no such mws developer config');

        const { accessKey, secretKey } = mwsConfig;

        return await this.mwsCreator.create(accessKey, secretKey, sellerId, marketplace, token);
    }
}
