import AmazonMWS = require('amazon-mws');
import {AmazonType} from "..";
import {getMarketplaceHost} from "./get-marketplace-host";
import {getMarketplaceId} from "./get-marketplace-id";
import {Injectable} from "injection-js";

export interface MwsOptions {
    SellerId: string;
    MarketplaceId: string; //TODO: it should be mws marketplace key
    MWSAuthToken?: string;
    Version?: string;
    Action?: string;
    FeedSubmissionId?: string;
    __RAW__?: boolean;
    FeedType?: string;
    FeedContent?: string;
    IdType?: string;
    'IdList.Id.1'?: string;
    Query?: string;
    ReportId?: string;
    ReportType?: string;
    'MarketplaceId.Id.1'?: string;
    'MarketplaceIdList.Id.1'?: string;
    'ReportRequestIdList.Id.1'?: string;
    LastUpdatedAfter?: Date;
    AmazonOrderId?: string;
    NextToken?: string;
}

export interface MwsState {
    mws: AmazonMWS;
    options: MwsOptions;
}

@Injectable()
export class MwsCreator {


    create(accessKey: string, secretKey: string, sellerId: string, marketplace: AmazonType, token?: string): MwsState {
        let marketplaceId = getMarketplaceId(marketplace);
        const options: MwsOptions = {
            SellerId: sellerId,
            MarketplaceId: marketplaceId,
        };
        if (token) options.MWSAuthToken = token;
        let mws = new AmazonMWS(accessKey, secretKey);
        mws.setHost(getMarketplaceHost(marketplace));

        return {
            mws,
            options,
        };
    }
}
