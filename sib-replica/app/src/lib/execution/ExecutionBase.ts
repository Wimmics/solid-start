import { Execution } from "./Execution";
import { Strategy, Targets } from "../strategy/Strategy";
import { Status } from "../Status";

export abstract class ExecutionBase implements Execution {
    protected strategies: Strategy[];
    protected queriedSkills: string[];
    protected queriedCities: string[];

    constructor(strategies: Strategy[]) {
        this.strategies = strategies;
        this.queriedSkills = [];
        this.queriedCities = [];
    }

    public isRunning(): boolean {
        return this.getStatus() === Status.RUNNING
    }

    public isTerminated(): boolean {
        return this.getStatus() === Status.TERMINATED
    }

    public abstract run(targets: Targets): Promise<void>;

    public getQueriedSkills(): string[] {
        return this.queriedSkills;
    }

    public getQueriedCities(): string[] {
        return this.queriedCities;
    }

    public abstract getStatus(): Status;

    public getStrategies(): Strategy[] {
        return this.strategies;
    }
}