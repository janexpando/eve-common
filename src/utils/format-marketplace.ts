import { MarketplaceName } from '../models/marketplace-names';

export function formatMarketplace(marketplace: MarketplaceName) {
    const upperCaseFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

    const [market, country] = marketplace.split('_');
    return `${upperCaseFirst(market)} ${country.toUpperCase()}`;
}
