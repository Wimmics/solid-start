import { Status } from "../Status";
import { Match } from "../match/Match";

export interface Result {
    getFirstResult(): number;
    getRequestsNumber(): number;
    getTotalTime(): number;
    getStatus(): Status;
    getMatches(): Match[];
    registerCallbackForStatus(callback: (status: Status) => void): void;
    registerCallbackForNewMatch(callback: (match: Match) => void): void;
}