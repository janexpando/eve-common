import {CurrencyCode} from "..";

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
    PLN: 4.27
};

export function convertCurrency(value: number, from: CurrencyCode, to: CurrencyCode): number {
    return (value / exchangeRates[from] * exchangeRates[to]) || 0;
}

