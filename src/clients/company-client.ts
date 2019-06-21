import {Injectable} from "injection-js";
import {Environment, EveClient} from "..";

@Injectable()
export class CompanyClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async getCompanies(): Promise<{ _id: string }[]> {
        let response = await this.got.get(`/company`);
        return response.body;
    }
}
