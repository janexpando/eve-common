import {Injectable} from 'injection-js';
import {ContinentName, Environment, EveClient} from "..";

@Injectable()
export class DeveloperConfigClient extends EveClient {
    protected constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async getMwsConfig(developerId: string): Promise<ApiMwsDeveloperConfig> {
        let response = await this.got.get(
            `/developer-config/${developerId}`,
        );
        return response.body;
    }
}

export interface ApiMwsDeveloperConfig {
    accessKey: string;
    secretKey: string;
    developerId: string;
    continent: ContinentName;
}
