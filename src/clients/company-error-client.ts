import {ObjectId} from 'bson';
import {EveClient} from "./eve-client";
import {Environment} from "../bootstrapping/environment";
import {Injectable} from "injection-js";

@Injectable()
export class CompanyErrorClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async set(companyId: ObjectId, code: string, message?: string) {
        let response = await this.got.post(`/company/${companyId}/company-error`, {
            json: true, body: {code, message}
        });
    }
}