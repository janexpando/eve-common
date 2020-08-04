import { test } from '../../testing';
import { isFeatureEnabledFor } from '../feature-toggles';
import { ApiFeatureToggle } from '../../clients/feature-toggle-client';

test('`isFeatureOnFor` default to `false` if no toggle is provided', t => {
    t.is(isFeatureEnabledFor('member-3', null), false);
});

test('`isFeatureOnFor` for "block" feature toggle gate', t => {
    const mockToggle: ApiFeatureToggle = {
        group: ['member-1', 'member-3'],
        name: 'auto-fulfillment',
        gate: 'block',
    };

    t.is(isFeatureEnabledFor('member-3', mockToggle), false);
    t.is(isFeatureEnabledFor('member-4', mockToggle), true);
});

test('`isFeatureOnFor` for "pass" feature toggle gate', t => {
    const mockToggle: ApiFeatureToggle = {
        group: ['member-1', 'member-3'],
        name: 'auto-fulfillment',
        gate: 'pass',
    };

    t.is(isFeatureEnabledFor('member-3', mockToggle), true);
    t.is(isFeatureEnabledFor('member-4', mockToggle), false);
});
