import { DAY, WEEK } from './time';

export function getYesterdayMidnight(date: Date = new Date()) {
    let yesterdayDate = new Date(date.valueOf() - DAY);
    return getMidnight(yesterdayDate);
}

export function getWeekStart(date: Date = new Date()) {
    let dayIndex = date.getDay();
    let lastWeekStart = date.getTime() - (dayIndex - 1) * DAY;
    return getMidnight(new Date(lastWeekStart));
}

export function getLastWeekStart(date: Date = new Date()) {
    let weekAgo = date.getTime() - WEEK;
    return getWeekStart(new Date(weekAgo));
}

export function getMidnight(date: Date): Date {
    if (!date) date = new Date(0);
    let yyyy = date.getFullYear();
    let dd: string | number = date.getDate();
    let mm: string | number = date.getMonth() + 1;

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    let yesterday = `${yyyy}-${mm}-${dd}`;

    return new Date(yesterday);
}

export function getTodayMidnight() {
    return getMidnight(new Date());
}

export function getMonthStart(date: Date = new Date()) {
    let yyyy = date.getFullYear();
    let mm: string | number = date.getMonth() + 1;

    if (mm < 10) {
        mm = '0' + mm;
    }
    return new Date(`${yyyy}-${mm}-01`);
}

export function getLastMonthStart(date: Date = new Date()) {
    let yyyy = date.getFullYear();
    let mm: string | number = date.getMonth();

    if (mm < 10) {
        mm = '0' + mm;
    }

    if (mm == 0) {
        mm = 12;
        yyyy--;
    }

    return new Date(`${yyyy}-${mm}-01`);
}
