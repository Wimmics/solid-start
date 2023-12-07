const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

export enum Status {
    READY = "Ready",
    RUNNING = "Running",
    TERMINATED = "Terminated"
}

export interface Execution {
    getStrategyName(): string;
    getSparqlQuery(): string;
    getQueriedSkills(): number[];
    getQueriedCities(): string[];
    getStatus(): Status;
    getResult(): Result;
    launch(): void;
}

export interface Strategy {
    getName(): string;
    getSparqlQuery(): string;
    execute(): void;
    getResult(): Result;
    setSources(sources: string[]): void;
}

export interface Result {
    getFirstResult(): number;
    getRequestsNumber(): number;
    getTotalTime(): number;
    getStatus(): Status;
    getMatches(): Match[];
}

export interface Match {
    getUser(): string;
    toString(): string;
    getMatchingTime(): number;
}

export class MatchBase implements Match {

    private user: string;
    private displayString: string;
    private matchingTime: number;

    constructor(user: string, displayString: string, matchingTime: number) {
        this.user = user;
        this.displayString = displayString;
        this.matchingTime = matchingTime;
    }

    public getUser(): string {
        return this.user;
    }

    public toString(): string {
        return this.displayString;
    }

    public getMatchingTime(): number {
        return this.matchingTime;
    }
    
}

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
        this.getStrategy().execute();
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

export class ResultBase implements Result {

    private startTime?: Date;
    private endTime?: Date;
    private totalTime: number;
    private status: Status;
    private matches: Match[];

    constructor() {
        this.totalTime = 0.0;
        this.status = Status.READY;
        this.matches = [];
    }

    protected computeEllapsedTime(startTime: Date, endTime: Date): number {
        let timeDiff: number = endTime.getTime() - startTime.getTime(); //in ms
        timeDiff /= 1000; // strip the ms
        return Math.round(timeDiff); // get seconds 
    }

    public getStartTime(): Date | undefined {
        return this.startTime;
    }

    public getEndTime(): Date | undefined {
        return this.endTime;
    }

    public getFirstResult(): number {
        throw new Error("Method not implemented.");
    }

    public getRequestsNumber(): number {
        throw new Error("Method not implemented.");
    }
    
    public getTotalTime(): number {
        return this.totalTime;
    }

    public getStatus(): Status {
        return this.status;
    }

    public addMatch(user: string, displayString: string): void {
        const startTime = this.getStartTime();

        if (!startTime)
            throw new Error("Unable to add match.");

        const matchingTime = this.computeEllapsedTime(startTime, new Date());
        this.matches.push(new MatchBase(user, displayString, matchingTime));
    }

    public getMatches(): Match[] {
        return this.matches;
    }

    public setRunning(): void {
        this.startTime = new Date();
        this.status = Status.RUNNING;
    }

    public setTerminated(): void {
        this.endTime = new Date();
        this.setTotalTime();
        this.status = Status.TERMINATED;
    }

    private setTotalTime(): void {
        const startTime = this.getStartTime();
        const endTime = this.getEndTime();

        if (!startTime || !endTime)
            throw new Error("Can't compute the total time of the strategy.");

        this.totalTime = this.computeEllapsedTime(startTime, endTime);
    }

}

export abstract class StrategyBase implements Strategy {
    protected name: string;
    protected sparqlQuery: string;
    protected engine: any;
    private result: ResultBase;
    private sources: string[];

    constructor(name: string, sparqlQuery: string, engine: any) {
        this.name = name;
        this.sparqlQuery = sparqlQuery;
        this.engine = engine;
        this.result = new ResultBase;
        this.sources = [];
    }

    public setSources(sources: string[]): void {
        this.sources = sources;
    }

    public getSources(): string[] {
        return this.sources;
    }

    public getName(): string {
        return this.name;
    }

    private setRunning(): void {
        this.getResult().setRunning();
    }

    private setTerminated(): void {
        this.getResult().setTerminated();
        console.log("Terminated query traversal");
    }

    protected abstract getBindingResult(binding: any): string;

    public async execute(): Promise<void> {
        this.setRunning();

        const bindingsStream = await this.getEngine().queryBindings(this.getSparqlQuery(), {
            lenient: true, // ignore HTTP fails
            sources: this.getSources(),
          });

        bindingsStream.on('data', (binding: any) => {
            const user = binding.get('firstName').value;
            const displayString = this.getBindingResult(binding);
            this.getResult().addMatch(user, displayString)
            // console.log(`Get result: ${firstName} ${lastName} (${city})`);
            //r.push();
            //update(r);
          });
      
        bindingsStream.on('end', () => {
            this.setTerminated();
        });
    }

    public getResult(): ResultBase {
        return this.result;
    }

    public getSparqlQuery(): string {
        return this.sparqlQuery;
    }

    protected getEngine(): any {
        return this.engine;
    }
}

export interface SourceProvider {
    getSources(): string[];
}

export class SourceProviderBase implements SourceProvider {

    private sources: string[];

    constructor() {
        this.sources = [];
    }

    public addSource(source: string): void {
        this.sources.push(source);
    }

    public getSources(): string[] {
        return this.sources;
    }

    public sourcesCount(): number {
        return this.sources.length;
    }

}

export class LocalSourceProvider extends SourceProviderBase {

    private instanceNumber: number;

    constructor(instanceNumber: number) {
        super();
        this.instanceNumber = instanceNumber;
    }

    public addSkills(skills: string[]): void {
        skills.forEach(skill => {
            for (let i = 1; i <= this.instanceNumber; i++) { 
                this.addSource(`http://localhost:${8000 + i}/indexes/skill/${skill}`)
            }
        });
    }

    public addCities(cities: string[]): void {
        cities.forEach(city => {
            for (let i = 1; i <= this.instanceNumber; i++) { 
                this.addSource(`http://localhost:${8000 + i}/indexes/city/${city}`)
            }
        });
    }
}

export class GlobalSourceProvider extends SourceProviderBase {

    public addSkills(skills: string[]): void {
        skills.forEach(skill => this.addSource(`http://localhost:8000/org/indexes/skill/${skill}`));
    }

    public addCities(cities: string[]): void {
        cities.forEach(city => this.addSource(`http://localhost:8000/org/indexes/city/${city}`));
    }
}

export class GlobalIndexStrategy extends StrategyBase {

    constructor() {
        super(
            "globalIndex",
            `SELECT DISTINCT ?user WHERE {
                ?index a <http://example.org#SkillIndex>;
                <http://example.org#entry> ?user
            } LIMIT 100`, 
            new QueryEngine
        )
    }

    protected getBindingResult(binding: any): string {
        const firstName = binding.get('firstName').value;
        const lastName = binding.get('lastName').value;
        const city = binding.get('city').value;
        return `${firstName} ${lastName} (${city})`;
    }

}

const ex = new ExecutionBase(new GlobalIndexStrategy, [12], ["paris"]);
/*await*/ ex.launch();
ex.getResult();