import {EveClient} from "./eve-client";
import {Environment} from "../bootstrapping/environment";
import {Injectable} from "injection-js";

@Injectable()
export class MallServiceClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.MALL_SERVICE_URL;
    }
}
