import { CurrencyCode } from '..';

const exchangeRates: Record<CurrencyCode, number> = {
    AUD: 1.61,
    BRL: 4.6,
    CAD: 1.46,
    CNY: 7.73,
    CZK: 25.59,
    EUR: 1,
    GBP: 0.86,
    INR: 79.39,
    JPY: 119.75,
    MXN: 21.44,
    USD: 1.1,
    SGD: 1.5,
    PLN: 4.27,
    RON: 4.83,
    HUF: 353.83,
    HKD: 9.0869,
    ISK: 159.0,
    PHP: 57.538,
    DKK: 7.4427,
    SEK: 10.287,
    IDR: 17042.29,
    RUB: 84.9125,
    HRK: 7.494,
    THB: 36.899,
    CHF: 1.0766,
    BGN: 1.9558,
    TRY: 8.1748,
    NOK: 10.6573,
    NZD: 1.764,
    ZAR: 19.3269,
    ILS: 3.9985,
    KRW: 1400.22,
    MYR: 4.9755,
};

export function convertCurrency(value: number, from: CurrencyCode, to: CurrencyCode): number {
    return (value / exchangeRates[from]) * exchangeRates[to] || 0;
}
