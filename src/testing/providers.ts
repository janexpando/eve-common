import { ConsoleLogger, DbDriver, ENVIRONMENT_PROVIDER, ProductAutopricingClient, ProductStatusesClient } from '..';
import { Provider } from 'injection-js';
import { MwsProvider } from '../mws/mws-provider';
import { MwsCredentialsClient } from '..';
import { CompanyClient } from '..';
import { AmazonProductClient } from '..';
import { DeveloperConfigClient } from '..';
import { FinancialEventsClient } from '..';
import { MarketplaceClient } from '..';
import { OrderClient } from '..';
import { ProductPricingClient } from '..';
import { ProductServiceClient } from '..';
import { ProductSyncClient } from '..';
import { SendinblueClient } from '..';
import { SettingsClient } from '..';
import { ShoptetServiceClient } from '..';
import { MwsCreator } from '..';
import { ShipmentClient } from '../clients/shipment-client';
import { ReturnClient } from '../clients/return-client';
import { NotificationsClient } from '..';
import { MallServiceClient } from '..';
import { HealthReporter } from '../logging/health-reporter';
import { ImportSettingsClient } from '../clients/import-settings-client';
import { EmagServiceClient } from '../clients/emag-service-client';

export const PROVIDERS: Provider[] = [
    ENVIRONMENT_PROVIDER,
    DbDriver,
    ConsoleLogger,
    MwsProvider,
    AmazonProductClient,
    CompanyClient,
    DeveloperConfigClient,
    FinancialEventsClient,
    MarketplaceClient,
    MwsCredentialsClient,
    OrderClient,
    ProductPricingClient,
    ProductServiceClient,
    ProductSyncClient,
    SendinblueClient,
    SettingsClient,
    ShipmentClient,
    ReturnClient,
    ShoptetServiceClient,
    MwsCreator,
    ProductStatusesClient,
    NotificationsClient,
    MallServiceClient,
    ProductAutopricingClient,
    HealthReporter,
    ImportSettingsClient,
    EmagServiceClient
];
