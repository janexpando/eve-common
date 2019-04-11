import {ConsoleLogger, DbDriver, ENVIRONMENT_PROVIDER} from "..";
import {Provider} from "injection-js";

export const PROVIDERS: Provider[] = [
        ENVIRONMENT_PROVIDER,
        DbDriver,
        ConsoleLogger,
    ]
;
