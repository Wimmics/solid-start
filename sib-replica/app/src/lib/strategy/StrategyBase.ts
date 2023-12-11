import { Strategy, Targets } from "./Strategy";
import { SourceProvider } from "../sourceProvider/SourceProvider";
import { ResultBase } from "../result/ResultBase";
import { Status } from "../Status";
import { Match } from "../match/Match";

export type SourceProviderFactory = (targets: Targets) => SourceProvider;

/**
 * An indexing strategy that does nothing.
 * It should be inherited to implement concreate strategies.
 * Subclasses must override the `execute` method after calling the one from super.
 * 
 * This class provides somes callbacks to get notified when some values change (status, matches).
 */
export class StrategyBase implements Strategy {
    private name: string;
    private description: string;
    private sparqlQuery: string;
    private result?: ResultBase;
    private status: Status;
    private sourceProviderFactory: SourceProviderFactory;
    private sources: string[];
    private callbackMatches: ((match: Match[]) => void)[];
    private callbackStatus: ((status: Status) => void)[];

    /**
     * Constructs a new `StrategyBase`.
     * @param name The name of the strategy.
     * @param description The description of the strategy.
     * @param sparqlQuery The SPARQL query that the strategy will process.
     * @param sourceProviderFactory A function to get a `SourceProvider` given some targets.
     */
    constructor(name: string, description: string, sparqlQuery: string, sourceProviderFactory: SourceProviderFactory) {
        this.name = name;
        this.description = description;
        this.sparqlQuery = sparqlQuery;
        this.status = Status.READY;
        this.sources = [];
        this.sourceProviderFactory = sourceProviderFactory;
        this.callbackMatches = [];
        this.callbackStatus = [];
        this.result = new ResultBase();
    }

    protected reset(): void {
        this.result = new ResultBase();
        this.notifyMatchesChange([]);
    }

    public isReady(): boolean {
        return this.getStatus() === Status.READY;
    }

    public isRunning(): boolean {
        return this.getStatus() === Status.RUNNING;
    }

    public isTerminated(): boolean {
        return this.getStatus() === Status.TERMINATED;
    }

    protected addMatchToResults(user: string, displayString: string): void {
        this.getResult().addMatch(user, displayString);
        this.notifyMatchesChange(this.getResult().getMatches());
    }

    protected notifyMatchesChange(matches: Match[]): void {
        this.callbackMatches.forEach(callback => callback(matches))
    }

    protected notifyStatusChange(status: Status): void {
        this.callbackStatus.forEach(callback => callback(status));
    }

    protected startTotalTimeTimer(): void {
        this.getResult().startTotalTimeTimer();
    }

    protected stopTotalTimeTimer(): void {
        this.getResult().stopTotalTimeTimer();
    }

    protected getSourceProvider(targets: Targets): SourceProvider {
        return this.sourceProviderFactory(targets);
    }

    protected setSources(targets: Targets): void {
        this.sources = this.getSourceProvider(targets).getSources();
    }

    protected getStatus(): Status {
        return this.status;
    }

    public getSources(): string[] {
        return this.sources;
    }

    public getTargetedSources(targets: Targets): string[] {
        return this.getSourceProvider(targets).getSources();
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    private setStatus(status: Status): void {
        this.status = status;
        this.notifyStatusChange(status);
    }

    protected setRunning(): void {
        this.startTotalTimeTimer();
        this.setStatus(Status.RUNNING);
        console.log(`Strategy ${this.getName()} started.`);
    }

    protected setTerminated(): void {
        this.stopTotalTimeTimer();
        this.setStatus(Status.TERMINATED);
        console.log(`Strategy ${this.getName()} terminated in ${this.getResult().getTotalTime()}s.`);
    }

    public async execute(targets: Targets): Promise<void> {
        this.reset();
        this.setSources(targets);
        return Promise.resolve();
    }

    public getResult(): ResultBase {
        return this.result!;
    }

    public getSparqlQuery(): string {
        return this.sparqlQuery;
    }

    public registerCallbackForMatchesChange(callback: (match: Match[]) => void, priority: number = 100): void {
        if (priority === 0)
            this.callbackMatches = [callback, ...this.callbackMatches];
        else this.callbackMatches.push(callback);
    }

    public registerCallbackForStatusChange(callback: (status: Status) => void, priority: number = 100): void {
        if (priority === 0)
            this.callbackStatus = [callback, ...this.callbackStatus];
        else this.callbackStatus.push(callback);
    }
}