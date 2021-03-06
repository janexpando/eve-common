import { MarketplaceRegion } from './marketplace-region';

export type AmazonEuropeType = 'amazon_de' | 'amazon_uk' | 'amazon_it' | 'amazon_fr' | 'amazon_es' | 'amazon_nl' | 'amazon_se' | 'amazon_tr' | 'amazon_pl';
export const AMAZON_EUROPE: AmazonEuropeType[] = [
    'amazon_de',
    'amazon_uk',
    'amazon_it',
    'amazon_fr',
    'amazon_es',
    'amazon_nl',
    'amazon_se',
    'amazon_tr',
    'amazon_pl'
];

export type AmazonAmericaType = 'amazon_mx' | 'amazon_us' | 'amazon_ca' | 'amazon_br';
export const AMAZON_AMERICA: AmazonAmericaType[] = ['amazon_mx', 'amazon_us', 'amazon_ca', 'amazon_br'];

export type AmazonFarEast = 'amazon_sg' | 'amazon_au' | 'amazon_jp';
export const AMAZON_FAR_EAST: AmazonFarEast[] = ['amazon_sg', 'amazon_au', 'amazon_jp'];

export type AmazonOtherType = 'amazon_in'; // TODO this should be part of europe
export const AMAZON_OTHER: AmazonOtherType[] = ['amazon_in'];

export type AmazonType = AmazonAmericaType | AmazonEuropeType | AmazonOtherType | AmazonFarEast;
export const AMAZON: AmazonType[] = []
    .concat(AMAZON_OTHER)
    .concat(AMAZON_EUROPE)
    .concat(AMAZON_AMERICA)
    .concat(AMAZON_FAR_EAST);

export type MallType = 'mall_cz' | 'mall_pl' | 'mall_sk' | 'mall_ro' | 'mall_hu';
export const MALL: MallType[] = ['mall_cz', 'mall_pl', 'mall_sk', 'mall_ro', 'mall_hu'];

export type AlzaType = 'alza_cz';
export const ALZA: AlzaType[] = ['alza_cz'];

export type EmagType = 'emag_pl' | 'emag_hu' | 'emag_ro' | 'emag_bg';
export const EMAG: EmagType[] = ['emag_pl', 'emag_hu', 'emag_ro', 'emag_bg'];

export type RealType = 'real_de';
export const REAL: RealType[] = ['real_de'];

export type MarketplaceName = AmazonType | MallType | AlzaType | EmagType | RealType;
export const MARKETPLACES: MarketplaceName[] = []
    .concat(AMAZON)
    .concat(MALL)
    .concat(ALZA)
    .concat(EMAG)
    .concat(REAL);

export function getRegionMarketplaces(region: MarketplaceRegion): MarketplaceName[] {
    switch (region) {
        case 'amazon_europe':
            return AMAZON_EUROPE;
        case 'amazon_america':
            return AMAZON_AMERICA;
        case 'amazon_far_east':
            return AMAZON_FAR_EAST;
        case 'amazon_other':
            return AMAZON_OTHER;
        case 'mall_cz':
            return ['mall_cz'];
        case 'mall_sk':
            return ['mall_sk'];
        case 'mall_pl':
            return ['mall_pl'];
        case 'mall_ro':
            return ['mall_ro'];
        case 'alza_cz':
            return ['alza_cz'];
        case 'real_de':
            return ['real_de'];
        default:
            return [];
    }
}

export function getRegion(marketplace: MarketplaceName): MarketplaceRegion {
    if (AMAZON_EUROPE.includes(marketplace as AmazonEuropeType)) return 'amazon_europe';
    if (AMAZON_AMERICA.includes(marketplace as AmazonAmericaType)) return 'amazon_america';
    if (AMAZON_FAR_EAST.includes(marketplace as AmazonFarEast)) return 'amazon_far_east';
    if (AMAZON_OTHER.includes(marketplace as AmazonOtherType)) return 'amazon_other';
    if ('mall_cz' == marketplace) return 'mall_cz';
    if ('mall_sk' == marketplace) return 'mall_sk';
    if ('mall_pl' == marketplace) return 'mall_pl';
    if ('mall_ro' == marketplace) return 'mall_ro';
    if ('mall_hu' == marketplace) return 'mall_hu';
    if ('alza_cz' == marketplace) return 'alza_cz';
    if ('emag_pl' == marketplace) return 'emag_pl';
    if ('emag_hu' == marketplace) return 'emag_hu';
    if ('emag_ro' == marketplace) return 'emag_ro';
    if ('emag_bg' == marketplace) return 'emag_bg';
    if ('real_de' == marketplace) return 'real_de';

    return null;
}

export type MarketplaceType = 'amazon' | 'mall' | 'alza' | 'emag' | 'real';
export const MARKETPLACE_TYPES: MarketplaceType[] = ['amazon', 'mall', 'alza', 'emag', 'real'];

export function getMarketplaceType(marketplace: MarketplaceName): MarketplaceType {
    if (AMAZON.includes(marketplace as AmazonType)) return 'amazon';
    if (MALL.includes(marketplace as MallType)) return 'mall';
    if (ALZA.includes(marketplace as AlzaType)) return 'alza';
    if (EMAG.includes(marketplace as EmagType)) return 'emag';
    if (REAL.includes(marketplace as RealType)) return 'real';
    return null;
}

export function getMarketplaceNamesForMarketplaceType(marketplaceType: MarketplaceType): MarketplaceName[] {
    switch (marketplaceType) {
        case 'alza':
            return ALZA;
        case 'amazon':
            return AMAZON;
        case 'mall':
            return MALL;
        case 'emag':
            return EMAG;
        case 'real':
            return REAL;
        default:
            return [];
    }
}
