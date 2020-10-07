import { Subject } from 'rxjs';
import { Injectable } from 'injection-js';
import { Environment } from './environment';
import mongoose = require('mongoose');
import { ConsoleLogger } from '..';

@Injectable()
export class DbDriver {
    connected: Subject<void> = new Subject();

    constructor(protected env: Environment, protected logg: ConsoleLogger) {
        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose.set('useUnifiedTopology', true);
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useCreateIndex', true);
        if (!!process.env.MONGOOSE_DEBUG === true) mongoose.set('debug', true);
        this.db.on('connected', async () => {
            logg.log('MongoDB connected');
            this.connected.next();
        });
        this.db.on('reconnected', () => logg.log('MongoDB reconnected'));
        this.db.on('disconnected', () => logg.log('MongoDB disconnected'));
    }

    connect() {
        return mongoose.connect(this.env.DB_URI, {
            // autoReconnect: true, // (node:22153) DeprecationWarning: The option `autoReconnect` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
            // reconnectTries: Number.MAX_VALUE, // (node:22153) DeprecationWarning: The option `reconnectTries` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
            autoIndex: false,
        });
    }

    async disconnect() {
        await mongoose.disconnect();
    }

    get db() {
        return mongoose.connection;
    }
}
