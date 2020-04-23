import { test } from '../../testing';
import { formatPhoneNumber } from '../phone-formatter';

test('Formatted and valid', t => {
    const result = formatPhoneNumber('0043(0)69910374372', 'AT');

    t.is(result.isValid, true);
    t.is(result.formattedNumber, '+4369910374372');
});

test('Formatted but invalid for country', t => {
    const result = formatPhoneNumber('0043(0)69910374372', 'CZ');

    t.is(result.formattedNumber, '+4369910374372');
    t.is(result.isValid, false);
});

test('Test out few...', t => {
    const shouldBeValid = [
        ['0172 / 8434400', 'DE'],
        ['01707390754', 'DE'],
        ['0170739 0754', 'DE'],
        ['02773/73549', 'DE'],
        ['0648550636', 'FR'],
        ['0664/3809348', 'AT'],
        ['3280460565', 'IT'],
        ['737225678', 'CZ'],
        ['0561-813199', 'DE'],
        [' 06021 8665496', 'DE'],
        ['+33632800204', 'FR']
    ];

    t.plan(shouldBeValid.length * 2)

    shouldBeValid.forEach(([number, country]) => {
        const result = formatPhoneNumber(number, country);

        t.is(result.isValid, true);
        t.not(result.formattedNumber, null)
    })
});