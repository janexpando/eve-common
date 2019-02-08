export function getMarketplaceCurrency(marketplace) {
    if (!marketplace || marketplace.trim() === '')
        throw new Error('marketplace parameter is empty');
    switch (marketplace) {
        case 'amazon_de':
            return 'EUR';
        case 'amazon_gb':
        case 'amazon_uk':
            return 'GBP';
        case 'amazon_mx':
            return 'MXN';
        case 'amazon_it':
            return 'EUR';
        case 'amazon_fr':
            return 'EUR';
        case 'amazon_us':
            return 'USD';
        case 'amazon_ca':
            return 'CAD';
        case 'amazon_es':
            return 'EUR';
        case 'amazon_br':
            return 'BRL';
        case 'amazon_in':
            return 'INR';
        case 'amazon_cn':
            return 'CNY';
        case 'amazon_jp':
            return 'JPY';
        case 'amazon_au':
            return 'AUD';
        default:
            throw new Error(`${marketplace} is not a valid amazon marketplace`);
    }
}
