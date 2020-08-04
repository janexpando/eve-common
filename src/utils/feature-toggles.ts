import { ApiFeatureToggle, FeatureToggleGate } from '../clients/feature-toggle-client';

function should(gateType: FeatureToggleGate) {
    return (member: string, featureToggle: ApiFeatureToggle): boolean => {
        const isMemberOfGroup: boolean = featureToggle.group.includes(member);
        return featureToggle.gate === gateType ? isMemberOfGroup : !isMemberOfGroup;
    };
}

export const shouldPass = should('pass');
export const shouldBlock = should('block');
