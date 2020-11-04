import { AmazonType } from '..';

export function isEuropeanMarketplace(marketplace: AmazonType): Boolean {
    return (
        marketplace === 'amazon_es' ||
        marketplace === 'amazon_uk' ||
        marketplace === 'amazon_fr' ||
        marketplace === 'amazon_de' ||
        marketplace === 'amazon_it' ||
        marketplace === 'amazon_nl' ||
        marketplace === 'amazon_se' ||
        marketplace === 'amazon_tr'
    );
}

export function isNorthAmericanMarketplace(marketplace: AmazonType): Boolean {
    return marketplace === 'amazon_us' || marketplace === 'amazon_ca' || marketplace === 'amazon_mx';
}

export function getMarketplaceHost(marketplace: AmazonType): string {
    if (marketplace === 'amazon_uk') return 'mws-eu.amazonservices.com';
    if (isEuropeanMarketplace(marketplace)) return 'mws-eu.amazonservices.com';
    if (isNorthAmericanMarketplace(marketplace)) return 'mws.amazonservices.com';
    if (marketplace === 'amazon_br') return 'mws.amazonservices.com';
    if (marketplace === 'amazon_in') return 'mws.amazonservices.in';
    if (marketplace === 'amazon_jp') return 'mws.amazonservices.jp';
    if (marketplace === 'amazon_au') return 'mws.amazonservices.com.au';
    if (marketplace === 'amazon_sg') return 'mws-fe.amazonservices.com';

    throw new Error(`${marketplace} is not a valid amazon marketplace`);
}
