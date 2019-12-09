import {ContinentName} from './continent-names';
import {MwsRegion} from "./mws-region";

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

export type AmazonAmericaType = 'amazon_mx' | 'amazon_us' | 'amazon_ca' | 'amazon_br';

export const AMAZON_AMERICA: AmazonAmericaType[] = [
    'amazon_mx',
    'amazon_us',
    'amazon_ca',
    'amazon_br',
];

export type AmazonFarEast = 'amazon_sg' | 'amazon_au'| 'amazon_jp';

export const AMAZON_FAR_EAST: AmazonFarEast[] = [
    'amazon_sg',
    'amazon_au',
    'amazon_jp'
];

export type AmazonOtherType =
    | 'amazon_in'
    | 'amazon_cn'

export const AMAZON_OTHER: AmazonOtherType[] = [
    'amazon_in',
    'amazon_cn',
];

export type AmazonType = AmazonAmericaType | AmazonEuropeType | AmazonOtherType | AmazonFarEast;

export const AMAZON: AmazonType[] = []
    .concat(AMAZON_OTHER)
    .concat(AMAZON_EUROPE)
    .concat(AMAZON_AMERICA)
    .concat(AMAZON_FAR_EAST);

export type MallType = 'mall_cz'

export const MALL: MallType[] = ['mall_cz'];

export type MarketplaceName = AmazonType | MallType;

export const MARKETPLACES: MarketplaceName[] = [].concat(AMAZON).concat(MALL);

export const america = AMAZON_AMERICA;

export const europe = AMAZON_EUROPE;


export function getContinentMarketplaces(continent: MwsRegion): MarketplaceName[] {
    switch (continent) {
        case 'europe':
            return AMAZON_EUROPE;
        case 'america':
            return AMAZON_AMERICA;
        case "far-east":
            return AMAZON_FAR_EAST;
        default:
            return [];
    }
}

export function getContinent(marketplace: MarketplaceName): MwsRegion {
    if (AMAZON_EUROPE.includes(marketplace as AmazonEuropeType))
        return 'europe';
    if (AMAZON_AMERICA.includes(marketplace as AmazonAmericaType))
        return 'america';
    if(AMAZON_FAR_EAST.includes(marketplace as AmazonFarEast))
        return 'far-east';
    return null; //TODO: we need to resolve all continents
}
