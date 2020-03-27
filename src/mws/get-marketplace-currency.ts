import { MarketplaceName } from '../models/marketplace-names';
import { CurrencyCode } from '..';

export function getMarketplaceCurrency(marketplace: MarketplaceName): CurrencyCode {
    if (!marketplace || marketplace.trim() === '') throw new Error('marketplace parameter is empty');
    switch (marketplace) {
        case 'amazon_de':
        case 'amazon_it':
        case 'amazon_fr':
        case 'amazon_es':
        case 'mall_sk':
        case 'amazon_nl':
            return 'EUR';
        // @ts-ignore
        case 'amazon_gb':
        case 'amazon_uk':
            return 'GBP';
        case 'amazon_mx':
            return 'MXN';
        case 'amazon_us':
            return 'USD';
        case 'amazon_ca':
            return 'CAD';
        case 'amazon_br':
            return 'BRL';
        case 'amazon_in':
            return 'INR';
        case 'amazon_jp':
            return 'JPY';
        case 'amazon_au':
            return 'AUD';
        case 'mall_cz':
        case "alza_cz":
            return 'CZK';
        case 'mall_pl':
            return 'PLN';
        case 'amazon_sg':
            return 'SGD';
        case 'mall_ro':
            return 'RON';
        default:
            throw new Error(`${marketplace} is not a valid amazon marketplace`);
    }
}
