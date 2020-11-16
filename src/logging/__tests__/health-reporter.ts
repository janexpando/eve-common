import { ObjectId } from 'bson';
import { provideInjector, test } from '../../testing';
import { HealthReporter } from '../health-reporter';
import * as timekeeper from 'timekeeper';

provideInjector(test);

/**
 * Creates callback hook for writes to `stdout`.
 */
function hookStdout(callback: (chunk: string) => void): () => void {
    const stdOutWrite = process.stdout.write.bind(process.stdout);

    process.stdout.write = function(chunk: string) {
        stdOutWrite(chunk);
        callback(chunk);
        return true;
    };

    return () => {
        process.stdout.write = stdOutWrite;
    };
}

test.serial('incidents are being reported correctly (incl. details)', async t => {
    const capturedLogs = [];
    const unhook = hookStdout(logString => capturedLogs.push(logString));
    const healthReporter = t.context.injector.get(HealthReporter);

    timekeeper.freeze(new Date());

    healthReporter.reportIncident('P0', 'Orders are not being downloaded', {
        incidentDetailsUrl: 'https://dev-wiki.expan.do/incidents/order-download',
        affectedCompanies: [new ObjectId(), new ObjectId()],
        timestamp: new Date('2020-11-13T15:37:16.788Z'),
    });

    unhook();

    t.is(capturedLogs.length, 1, `Didn't capture the expected number of logs`);

    const parsedLog = JSON.parse(capturedLogs[0]);

    t.is(parsedLog.level, 60, `Didn't log as 'fatal'`);
    t.is(parsedLog.p, 'P0', `Didn't use correct priority`);
    t.true(parsedLog.summary.includes('Orders'), `Didn't use correct summary`);
    t.true(parsedLog.incidentDetailsUrl.includes('incidents/order-download'), `Didn't use correct URL`);
    t.is(parsedLog.affectedCompaniesCount, 2, `Doesn't have correct affected companies count`);
    t.is(parsedLog.affectedCompanies.length, 2, `Doesn't have correct number of affected companies`);
    t.is(parsedLog.timestamp, '2020-11-13T15:37:16.788Z', `Doesn't have correct incident timestamp`);

    timekeeper.reset();
});

test.serial('incidents are being reported correctly (w/o details)', async t => {
    const capturedLogs = [];
    const unhook = hookStdout(logString => capturedLogs.push(logString));
    const healthReporter = t.context.injector.get(HealthReporter);

    const now = new Date();
    timekeeper.freeze(now);

    healthReporter.reportIncident('P1', 'Some weird state that needs correcting');

    unhook();

    t.is(capturedLogs.length, 1, `Didn't capture the expected number of logs`);

    const parsedLog = JSON.parse(capturedLogs[0]);

    t.is(parsedLog.level, 60, `Didn't log as 'fatal'`);
    t.is(parsedLog.p, 'P1', `Didn't use correct priority`);
    t.true(parsedLog.summary.includes('weird state'), `Didn't use correct summary`);
    t.is(parsedLog.incidentDetailsUrl, 'about:blank', `Didn't use correct URL`);
    t.is(parsedLog.affectedCompaniesCount, 0, `Doesn't have correct affected companies count`);
    t.is(parsedLog.affectedCompanies, 'unknown', `Doesn't have correct info for affected companies`);
    t.is(parsedLog.timestamp, now.toISOString(), `Doesn't have correct incident timestamp`);

    timekeeper.reset();
});

test.serial('health check heartbeat messages are being reported correctly', async t => {
    const capturedLogs = [];
    const unhook = hookStdout(logString => capturedLogs.push(logString));

    const healthReporter = t.context.injector.get(HealthReporter);

    healthReporter.heartbeat('order-throughput');

    unhook();

    t.is(capturedLogs.length, 1, `Didn't capture the expected number of logs`);

    const parsedLog = JSON.parse(capturedLogs[0]);

    t.is(parsedLog.level, 30, `Didn't log as 'info'`);
    t.is(parsedLog.message, 'heartbeat', `Didn't use correct message`);
    t.is(parsedLog.healthMetric, 'order-throughput', `Didn't use correct health metric name`);
});
