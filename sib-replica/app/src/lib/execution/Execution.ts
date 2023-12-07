import { Status } from "../Status";
import { Result } from "../result/Result";

export interface Execution {
    getStrategyName(): string;
    getSparqlQuery(): string;
    getQueriedSkills(): number[];
    getQueriedCities(): string[];
    getStatus(): Status;
    getResult(): Result;
    launch(): void;
}