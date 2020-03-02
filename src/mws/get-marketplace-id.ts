import { AmazonType } from '../models/marketplace-names';

export function getMarketplaceId(marketplace: AmazonType) {
    if (!marketplace || marketplace.trim() === '') throw new Error('marketplace parameter is empty');
    switch (marketplace) {
        case 'amazon_de':
            return 'A1PA6795UKMFR9';
        case 'amazon_gb' as 'amazon_uk':
        case 'amazon_uk':
            return 'A1F83G8C2ARO7P';
        case 'amazon_mx':
            return 'A1AM78C64UM0Y8';
        case 'amazon_it':
            return 'APJ6JRA9NG5V4';
        case 'amazon_fr':
            return 'A13V1IB3VIYZZH';
        case 'amazon_us':
            return 'ATVPDKIKX0DER';
        case 'amazon_ca':
            return 'A2EUQ1WTGCTBG2';
        case 'amazon_es':
            return 'A1RKKUPIHCS9HS';
        case 'amazon_br':
            return 'A2Q3Y263D00KWC';
        case 'amazon_in':
            return 'A21TJRUUN4KGV';
        case 'amazon_cn':
            return 'AAHKV2X7AFYLW';
        case 'amazon_jp':
            return 'A1VC38T7YXB528';
        case 'amazon_au':
            return 'A39IBJ37TRP1C6';
        case 'amazon_sg':
            return 'A19VAU5U5O7RUS';
        case 'amazon_nl':
            return 'A1805IZSGTT6HS';
        default:
            throw new Error(`${marketplace} is not a valid amazon marketplace`);
    }
}
