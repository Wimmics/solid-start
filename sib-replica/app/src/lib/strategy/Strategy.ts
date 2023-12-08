import { Result } from "../result/Result";

export interface Strategy {
    getName(): string;
    getDescription(): string;
    getSparqlQuery(): string;
    execute(targets: Targets): Promise<void>;
    getResult(): Result;
}

export interface Targets {
    skills: string[];
    cities: string[];
}