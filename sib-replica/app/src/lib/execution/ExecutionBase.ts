import { Execution } from "./Execution";
import { Strategy } from "../strategy/Strategy";
import { Status } from "../Status";
import { Result } from "../result/Result";

export class ExecutionBase implements Execution {
    protected strategy: Strategy;
    protected queriedSkills: number[];
    protected queriedCities: string[];

    constructor(strategy: Strategy, queriedSkills: number[], queriedCities: string[]) {
        this.strategy = strategy;
        this.queriedSkills = queriedSkills;
        this.queriedCities = queriedCities;
    }

    public launch(): void {
        //this.getStrategy().execute();
    }

    public getStrategyName(): string {
        return this.getStrategy().getName();
    }
    
    public getSparqlQuery(): string {
        return this.getStrategy().getSparqlQuery();
    }

    public getQueriedSkills(): number[] {
        return this.queriedSkills;
    }

    public getQueriedCities(): string[] {
        return this.queriedCities;
    }

    public getStatus(): Status {
        return this.getStrategy().getResult().getStatus();
    }

    public getResult(): Result {
        return this.getStrategy().getResult();
    }

    protected getStrategy(): Strategy {
        return this.strategy;
    }
}