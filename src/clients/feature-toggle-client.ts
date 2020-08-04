import 'reflect-metadata';
import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { Environment } from '..';

export type FeatureToggleGate = 'pass' | 'block';

export interface ApiFeatureToggle {
    name: string;
    gate: FeatureToggleGate;
    group: string[];
}

@Injectable()
export class FeatureToggleClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.GATEWAY_URL;
    }

    async createFeatureToggle(name: string, gate: FeatureToggleGate, group: string[] = []): Promise<ApiFeatureToggle> {
        const response = await this.got.post(`/feature-toggles`, { json: true, body: { name, gate, group } });
        return response.body;
    }

    async getFeatureToggle(name: string): Promise<ApiFeatureToggle> {
        const response = await this.got.get(`/feature-toggles/${name}`, { json: true });
        return response.body;
    }

    async updateFeatureToggle(name: string, gate: FeatureToggleGate): Promise<ApiFeatureToggle> {
        const response = await this.got.patch(`/feature-toggles/${name}`, { json: true, body: { gate } });
        return response.body;
    }

    async addGroupMember(name: string, groupMember: string): Promise<ApiFeatureToggle> {
        const response = await this.got.post(`/feature-toggles/${name}/group`, {
            json: true,
            body: { member: groupMember },
        });
        return response.body;
    }

    async removeGroupMember(name: string, groupMember: string): Promise<ApiFeatureToggle> {
        const response = await this.got.delete(`/feature-toggles/${name}/group/${groupMember}`, { json: true });
        return response.body;
    }
}
