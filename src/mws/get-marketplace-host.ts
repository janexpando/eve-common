import {AmazonType} from "..";


export function isEuropeanMarketplace(marketplace) {
    return (
        marketplace === 'amazon_es' ||
        marketplace === 'amazon_uk' ||
        marketplace === 'amazon_fr' ||
        marketplace === 'amazon_de' ||
        marketplace === 'amazon_it'
    );
}

export function isNorthAmericanMarketplace(marketplace) {
    return (
        marketplace === 'amazon_us' ||
        marketplace === 'amazon_ca' ||
        marketplace === 'amazon_mx'
    );
}

export function getMarketplaceHost(marketplace: AmazonType): string {
    if (marketplace === 'amazon_uk') return 'mws-eu.amazonservices.com';
    if (isEuropeanMarketplace(marketplace)) return 'mws-eu.amazonservices.com';
    if (isNorthAmericanMarketplace(marketplace))
        return 'mws.amazonservices.com';
    if (marketplace === 'amazon_br') return 'mws.amazonservices.com';
    if (marketplace === 'amazon_in') return 'mws.amazonservices.in';
    if (marketplace === 'amazon_cn') return 'mws.amazonservices.com.cn';
    if (marketplace === 'amazon_jp') return 'mws.amazonservices.jp';
    if (marketplace === 'amazon_au') return 'mws.amazonservices.com.au';

    throw new Error(`${marketplace} is not a valid amazon marketplace`);
}