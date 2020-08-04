import { test } from '../../testing';
import { shouldPass, shouldBlock } from '../feature-toggles';
import { ApiFeatureToggle } from '../../clients/feature-toggle-client';

test('`shouldPass` for "block" feature toggle gate', t => {
    const mockToggle: ApiFeatureToggle = {
        group: ['member-1', 'member-3'],
        name: 'auto-fulfillment',
        gate: 'block',
    };

    t.is(shouldPass('member-3', mockToggle), false);
    t.is(shouldPass('member-4', mockToggle), true);
});

test('`shouldPass` for "pass" feature toggle gate', t => {
    const mockToggle: ApiFeatureToggle = {
        group: ['member-1', 'member-3'],
        name: 'auto-fulfillment',
        gate: 'pass',
    };

    t.is(shouldPass('member-3', mockToggle), true);
    t.is(shouldPass('member-4', mockToggle), false);
});

test('`shouldBlock` for "block" feature toggle gate', t => {
    const mockToggle: ApiFeatureToggle = {
        group: ['member-1', 'member-3'],
        name: 'auto-fulfillment',
        gate: 'block',
    };

    t.is(shouldBlock('member-3', mockToggle), true);
    t.is(shouldBlock('member-4', mockToggle), false);
});

test('`shouldBlock` for "pass" feature toggle gate', t => {
    const mockToggle: ApiFeatureToggle = {
        group: ['member-1', 'member-3'],
        name: 'auto-fulfillment',
        gate: 'pass',
    };

    t.is(shouldBlock('member-3', mockToggle), false);
    t.is(shouldBlock('member-4', mockToggle), true);
});
