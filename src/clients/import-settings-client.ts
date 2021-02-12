import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { Environment } from '../bootstrapping/environment';
import { ApiImportSettings } from '../settings/import-settings-model';

@Injectable()
export class ImportSettingsClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
    }

    async updateImportSettings(importSettingsUpdate: Partial<ApiImportSettings>): Promise<ApiImportSettings> {
        const response = await this.got.patch(`${this.env.GATEWAY_URL}/import-settings`, {
            body: importSettingsUpdate,
        });
        return response.body;
    }
}
