import * as LPN from 'google-libphonenumber';

const PhoneUtil = LPN.PhoneNumberUtil.getInstance();
const FORMAT = LPN.PhoneNumberFormat.E164;

const muteErrors = (call: Function) => {
    try {
        return call();
    } catch (e) {
        return null;
    }
};

export function formatPhoneNumber(
    phoneNumber: string,
    countryCode: string,
): {
    formattedNumber: string | null;
    isValid: boolean;
} {
    const parsedNumber = muteErrors(() => PhoneUtil.parseAndKeepRawInput(phoneNumber, countryCode));
    const formattedNumber = muteErrors(() => PhoneUtil.format(parsedNumber, FORMAT));
    const isValid = muteErrors(() => PhoneUtil.isValidNumberForRegion(parsedNumber, countryCode));

    return {
        formattedNumber,
        isValid: !!isValid,
    };
}

export function isPhoneNumberValid(phoneNumber: string, countryCode: string): boolean {
    const parsedNumber = muteErrors(() => PhoneUtil.parseAndKeepRawInput(phoneNumber, countryCode));
    const isValid = muteErrors(() => PhoneUtil.isValidNumberForRegion(parsedNumber, countryCode));

    return !!isValid;
}
