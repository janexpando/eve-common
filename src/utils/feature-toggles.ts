import { ApiFeatureToggle } from '../clients/feature-toggle-client';

export function isFeatureEnabledFor(member: string, featureToggle: ApiFeatureToggle | null): boolean {
    if (!featureToggle) return false;

    const isMemberOfGroup: boolean = featureToggle.group.includes(member);
    return featureToggle.gate === 'pass' ? isMemberOfGroup : !isMemberOfGroup;
}
