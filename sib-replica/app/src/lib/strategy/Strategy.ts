import { Result } from "../result/Result";

export interface Strategy {
    getName(): string;
    getDescription(): string;
    getSparqlQuery(): string;
    execute(targets: Targets): void;
    getResult(): Result;
    //setSources(sources: string[]): void;
}

export interface Targets {
    skills: string[];
    cities: string[];
}