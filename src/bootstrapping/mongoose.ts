import {Subject} from "rxjs";
import {Logger} from "winston";
import {Injectable} from "injection-js";

const mongoose = require('mongoose');

@Injectable()
export class DbDriver {

    connected: Subject<void> = new Subject();

    constructor(protected connString: string,
                protected logg: Logger) {

        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useNewUrlParser', true);
        this.db.on('connected', async () => {
            logg.info('MongoDB connected');
            this.connected.next();
        });
        this.db.on('reconnected', () => logg.info('MongoDB reconnected'));
        this.db.on('disconnected', () => logg.info('MongoDB disconnected'));
    }

    connect() {
        return mongoose.connect(
            this.connString,
            {
                autoReconnect: true,
                reconnectTries: Number.MAX_VALUE,
            },
        );
    };

    disconnect() {
        mongoose.disconnect();
    }

    get db() {
        return mongoose.connection;
    }
}
