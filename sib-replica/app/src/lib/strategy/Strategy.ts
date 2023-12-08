import { Result } from "../result/Result";
import { Status } from "../Status";
import { Match } from "../match/Match";

export interface Strategy {
    getName(): string;
    getDescription(): string;
    getSparqlQuery(): string;
    execute(targets: Targets): Promise<void>;
    getTargetedSources(targets: Targets): string[];
    getStatus(): Status;
    getResult(): Result;
    registerCallbackForStatusChange(callback: (status: Status) => void): void;
    registerCallbackForMatchesChange(callback: (match: Match[]) => void): void;
}

export interface Targets {
    skills: string[];
    cities: string[];
}