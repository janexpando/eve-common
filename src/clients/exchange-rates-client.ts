import 'reflect-metadata';
import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { Environment } from '..';
import { CurrencyCode } from '../models/currency';

export interface ApiExchangeRates {
    day: Date;
    baseCurrency: CurrencyCode;
    rates: { [key in CurrencyCode]: number };
    refreshedAt: Date;
}

export interface ApiQuoteExchangeRate {
    day: Date;
    baseCurrency: CurrencyCode;
    quoteCurrency: CurrencyCode;
    rate: number;
    refreshedAt: Date;
}

const isToday = (date: Date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const formatDaySpec = (day?: Date) => (!day || isToday(day) ? 'latest' : day.toISOString().slice(0, 10));

@Injectable()
export class ExchangeRatesClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.GATEWAY_URL;
    }

    async exchangeRatesFor(baseCurrency: CurrencyCode, day?: Date): Promise<ApiExchangeRates> {
        const response = await this.got.get(`/exchange-rates/${formatDaySpec(day)}/${baseCurrency}`);
        return response.body;
    }

    async quoteRateFor(
        baseCurrency: CurrencyCode,
        quoteCurrency: CurrencyCode,
        day?: Date,
    ): Promise<ApiQuoteExchangeRate> {
        const response = await this.got.get(`/exchange-rates/${formatDaySpec(day)}/${baseCurrency}/${quoteCurrency}`);
        return response.body;
    }
}
