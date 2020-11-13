import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { ConsoleLogger } from './console-logger';

export type IncidentPriority = 'P0' | 'P1';

export interface IncidentReportDetails {
    incidentDetailsUrl?: string;
    timestamp?: Date;
    affectedCompanies?: (ObjectId | string)[];
}

/**
 * Simple component for reporting health of business processes in an uniform
 * way so that their status can be consumed easily by downstream components
 * (alert triggers, etc)
 */
@Injectable()
export class HealthReporter {
    constructor(private consoleLogger: ConsoleLogger) {}

    /**
     * Report the occurrence of an incident. This may result in a series
     * of alert messages sent by downstream components.
     */
    public reportIncident(priority: IncidentPriority, summary: string, details: IncidentReportDetails = {}) {
        this.consoleLogger.fatal({
            p: priority,
            summary,
            incidentDetailsUrl: details.incidentDetailsUrl || 'about:blank',
            affectedCompanies: details.affectedCompanies || 'unknown',
            affectedCompaniesCount: (details.affectedCompanies && details.affectedCompanies.length) || 0,
            timestamp: details.timestamp || new Date(),
        });
    }

    /**
     * Report that a health check for given `healthMetric` was successfully
     * done. Absence of heartbeat series may result in an alarm situation
     * triggered by downstream components.
     */
    public heartbeat(healthMetric: string) {
        this.consoleLogger.log({ message: 'heartbeat', healthMetric });
    }
}
