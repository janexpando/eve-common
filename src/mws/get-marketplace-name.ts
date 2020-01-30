import { AmazonType } from '../models/marketplace-names';

export function getMarketplaceName(marketplaceId: string): AmazonType {
    if (!marketplaceId || marketplaceId.trim() === '') throw new Error('marketplaceId parameter is empty');
    switch (marketplaceId) {
        case 'A1PA6795UKMFR9':
            return 'amazon_de';
        case 'A1F83G8C2ARO7P':
            return 'amazon_uk';
        case 'A1AM78C64UM0Y8':
            return 'amazon_mx';
        case 'APJ6JRA9NG5V4':
            return 'amazon_it';
        case 'A13V1IB3VIYZZH':
            return 'amazon_fr';
        case 'ATVPDKIKX0DER':
            return 'amazon_us';
        case 'A2EUQ1WTGCTBG2':
            return 'amazon_ca';
        case 'A1RKKUPIHCS9HS':
            return 'amazon_es';
        case 'A2Q3Y263D00KWC':
            return 'amazon_br';
        case 'A21TJRUUN4KGV':
            return 'amazon_in';
        case 'AAHKV2X7AFYLW':
            return 'amazon_cn';
        case 'A1VC38T7YXB528':
            return 'amazon_jp';
        case 'A39IBJ37TRP1C6':
            return 'amazon_au';
        case 'A19VAU5U5O7RUS':
            return 'amazon_sg';
        default:
            throw new Error(`${marketplaceId} is not a valid amazon marketplace`);
    }
}
