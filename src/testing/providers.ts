import {ConsoleLogger, DbDriver, ENVIRONMENT_PROVIDER} from "..";
import {Provider} from "injection-js";
import {MwsProvider} from "../mws/mws-provider";
import {MwsCredentialsClient} from "../clients/mws-credentials-client";
import {CompanyClient} from "../clients/company-client";
import {BlacklistClient} from "../clients/blacklist-client";
import {DeveloperConfigClient} from "../clients/developer-config-client";
import {FinancialEventsClient} from "../clients/financial-events-client";
import {MarketplaceClient} from "../clients/marketplace-client";
import {OrderDownloaderClient} from "../clients/order-downloader-client";
import {ProductPricingClient} from "../clients/product-pricing-client";
import {ProductServiceClient} from "../clients/product-service-client";
import {ProductSyncClient} from "../clients/product-sync-client";
import {SendinblueClient} from "../clients/sendinblue-client";
import {SettingsClient} from "../clients/settings-client";
import {ShoptetServiceClient} from "../clients/shoptet-service-client";
import {MwsCreator} from "../mws/mws-creator";

export const PROVIDERS: Provider[] = [
        ENVIRONMENT_PROVIDER,
        DbDriver,
        ConsoleLogger,
        MwsProvider,
        BlacklistClient,
        CompanyClient,
        DeveloperConfigClient,
        FinancialEventsClient,
        MarketplaceClient,
        MwsCredentialsClient,
        OrderDownloaderClient,
        ProductPricingClient,
        ProductServiceClient,
        ProductSyncClient,
        SendinblueClient,
        SettingsClient,
        ShoptetServiceClient,
        MwsCreator,
    ]
;
