import { ObjectId } from 'bson';
import { Injectable } from 'injection-js';
import { ConsoleLogger, sleep } from '..';

export interface ShieldOptions<T> {
    fn: () => Promise<T>;
    sleepTime: number;
    procedureId?: string;
    companyId: ObjectId;
    operation: string;
    skipLog?: boolean;
}

@Injectable()
export class ThrottleShield {
    constructor(private logger: ConsoleLogger) {}

    async shield<T>(options: ShieldOptions<T>): Promise<T> {
        while (true) {
            try {
                let result = await options.fn();
                return result;
            } catch (e) {
                if (e.Code == 'RequestThrottled') {
                    if (!options.skipLog) {
                        this.logger.json({
                            companyId: options.companyId,
                            operation: options.operation,
                            message: e.Code,
                            procedureId: options.procedureId,
                        });
                    }
                    await sleep(options.sleepTime || 10000);
                } else throw e;
            }
        }
    }
}
