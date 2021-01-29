import { MarketplaceName } from '../models/marketplace-names';
import { pascal, upper } from 'case';

export function formatMarketplace(marketplace: MarketplaceName) {
    let [market, country] = marketplace.split('_');
    return `${pascal(market)} ${upper(country)}`;
}
