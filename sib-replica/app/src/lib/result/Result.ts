import { Status } from "../Status";
import { Match } from "../match/Match";

export interface Result {
    getFirstResult(): number;
    getRequestsNumber(): number;
    getTotalTime(): number;
    getMatches(): Match[];
}