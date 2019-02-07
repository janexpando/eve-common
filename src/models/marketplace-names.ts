import { ContinentName } from './continent-names';

export type AmazonEuropeType =
    | 'amazon_de'
    | 'amazon_uk'
    | 'amazon_it'
    | 'amazon_fr'
    | 'amazon_es';

export const AMAZON_EUROPE: AmazonEuropeType[] = [
    'amazon_de',
    'amazon_uk',
    'amazon_it',
    'amazon_fr',
    'amazon_es',
];
export type AmazonAmericaType = 'amazon_mx' | 'amazon_us' | 'amazon_ca';

export const AMAZON_AMERICA: AmazonAmericaType[] = [
    'amazon_mx',
    'amazon_us',
    'amazon_ca',
];

export type AmazonOtherType =
    | 'amazon_br'
    | 'amazon_in'
    | 'amazon_cn'
    | 'amazon_jp'
    | 'amazon_au';

export const AMAZON_OTHER: AmazonOtherType[] = [
    'amazon_br',
    'amazon_in',
    'amazon_cn',
    'amazon_jp',
    'amazon_au',
];

export type AmazonType = AmazonAmericaType | AmazonEuropeType | AmazonOtherType;

export const AMAZON: AmazonType[] = []
    .concat(AMAZON_OTHER)
    .concat(AMAZON_EUROPE)
    .concat(AMAZON_AMERICA);

export type MarketplaceName = AmazonType;

export const MARKETPLACES = AMAZON;

export const america = AMAZON_AMERICA;

export const europe = AMAZON_EUROPE;


export function getContinentMarketplaces(continent: ContinentName): MarketplaceName[] {
    switch (continent) {
    case 'europe':
        return AMAZON_EUROPE;
    case 'america':
        return AMAZON_AMERICA;
    default:
        return [];
    }
}
