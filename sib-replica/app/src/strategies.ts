const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

export enum Status {
    READY = "Ready",
    RUNNING = "Running",
    TERMINATED = "Terminated"
}

export interface Execution {
    getStrategy(): Strategy;
    getQueriedSkills(): string[];
    getQueriedCities(): string[];
    getStatus(): Status;
    getResult(): ExecutionResult;
    launch(): void;
}

export interface Strategy {
    getSparqlQuery(): string;
    getEngine(): any;
    execute(): void;
    getResult(): string[];
}

export interface ExecutionResult {
    getStrategy(): Strategy;
    getFirstResult(): number;
    getRequestsNumber(): number;
    getTotalTime(): number;
    getStatus(): Status;
    getResults(): string[];
}

export class ExecutionBase implements Execution {
    protected strategy: Strategy;
    protected status: Status;
    protected queriedSkills: string[];
    protected queriedCities: string[];
    private result: ExecutionResultBase;

    constructor(strategy: Strategy, queriedSkills: string[], queriedCities: string[]) {
        this.strategy = strategy;
        this.queriedSkills = queriedSkills;
        this.queriedCities = queriedCities;
        this.status = Status.READY;
        this.result = new ExecutionResultBase;
    }

    private computeTotalTime(startTime: Date, endTime: Date): number {
        let timeDiff: number = endTime.getTime() - startTime.getTime(); //in ms
        timeDiff /= 1000; // strip the ms
        return Math.round(timeDiff); // get seconds 
    }

    public launch(): void {
        const startTime = new Date();
        this.strategy.execute();    
        const endTime = new Date();
        const totalTime = this.computeTotalTime(startTime, endTime);
        this.result.setTotalTime(totalTime);
    }

    public getStrategy(): Strategy {
        return this.strategy;
    }

    public getQueriedSkills(): string[] {
        return this.queriedSkills;
    }

    public getQueriedCities(): string[] {
        return this.queriedCities;
    }

    public getStatus(): Status {
        return this.status;
    }

    public getResult(): ExecutionResult {
        return this.result;
    }
}

export class ExecutionResultBase implements ExecutionResult {
    getStrategy(): Strategy {
        throw new Error("Method not implemented.");
    }
    getFirstResult(): number {
        throw new Error("Method not implemented.");
    }
    getRequestsNumber(): number {
        throw new Error("Method not implemented.");
    }
    getTotalTime(): number {
        throw new Error("Method not implemented.");
    }
    getStatus(): Status {
        throw new Error("Method not implemented.");
    }
    getResults(): string[] {
        throw new Error("Method not implemented.");
    }

    setTotalTime(totalTime: number): void {

    }

}

export class StrategyBase implements Strategy {
    protected sparqlQuery: string;
    protected engine: any;

    constructor(sparqlQuery: string, engine: any) {
        this.sparqlQuery = sparqlQuery;
        this.engine = engine;
    }

    public execute(): void {
        
    }

    public getResult(): string[] {
        return [];
    }

    public getSparqlQuery(): string {
        return this.sparqlQuery;
    }

    public getEngine(): any {
        return this.engine;
    }
}

export const globalIndex = new StrategyBase(
    `SELECT DISTINCT ?user WHERE {
        ?index a <http://example.org#SkillIndex>;
        <http://example.org#entry> ?user
    } LIMIT 100`, 
    new QueryEngine
);