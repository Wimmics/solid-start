import { Strategy, Targets } from "./Strategy";
import { SourceProvider } from "../sourceProvider/SourceProvider";
import { ResultBase } from "../result/ResultBase";
import { Status } from "../Status";
import { Match } from "../match/Match";

export class StrategyBase implements Strategy {
    private name: string;
    private description: string;
    private sparqlQuery: string;
    private engine: any;
    private result: ResultBase;
    private status: Status;
    private sourceProvider: (targets: Targets) => SourceProvider;
    private sources: string[];
    private matchDisplay?: (binding: any) => string;
    private callbackMatches: ((match: Match[]) => void)[];
    private callbackStatus: ((status: Status) => void)[];

    constructor(name: string, description: string, sparqlQuery: string, engine: any, sourceProvider: (targets: Targets) => SourceProvider, matchDisplay?: (binding: any) => string) {
        this.name = name;
        this.description = description;
        this.sparqlQuery = sparqlQuery;
        this.engine = engine;
        this.result = new ResultBase;
        this.status = Status.READY;
        this.sources = [];
        this.sourceProvider = sourceProvider;
        this.matchDisplay = matchDisplay;
        this.callbackMatches = [];
        this.callbackStatus = [];
    }

    private reset(): void {
        this.result = new ResultBase;
        this.callbackMatches.forEach(callback => callback([]))
    }

    private setSources(targets: Targets): void {
        this.sources = this.sourceProvider(targets).getSources();
    }

    public getStatus(): Status {
        return this.status;
    }

    public getSources(): string[] {
        return this.sources;
    }

    public getTargetedSources(targets: Targets): string[] {
        return this.sourceProvider(targets).getSources();
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    private setStatus(status: Status): void {
        this.status = status;
        this.callbackStatus.forEach(callback => callback(status));
    }

    private setRunning(): void {
        this.setStatus(Status.RUNNING);
        console.log(`Strategy ${this.getName()} started.`);
        this.getResult().setRunning();
    }

    private setTerminated(): void {
        this.setStatus(Status.TERMINATED);
        this.getResult().setTerminated();
        console.log(`Strategy ${this.getName()} terminated in ${this.getResult().getTotalTime()}s.`);
    }

    protected getBindingResult(binding: any): string {
        return binding.get('user').value;
    }

    private addMatch(user: string, displayString: string): void {
        this.getResult().addMatch(user, displayString);
        this.callbackMatches.forEach(callback => callback(this.getResult().getMatches()))
    }

    public async execute(targets: Targets): Promise<void> {
        this.reset();
        this.setSources(targets);
        this.setRunning();

        const bindingsStream = await this.getEngine().queryBindings(this.getSparqlQuery(), {
            lenient: true, // ignore HTTP fails
            sources: this.getSources(),
          });

        bindingsStream.on('data', (binding: any) => {
            const user = binding.get('user').value;
            const displayString = this.matchDisplay? this.matchDisplay(binding): user;
            this.addMatch(user, displayString);
          });
      
        return new Promise<void>((resolve, reject) => {
            bindingsStream.on('end', () => {
                this.setTerminated();
                resolve();
            });
            bindingsStream.on('error', (error: Error) => {
                reject(error);
            });
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

    public registerCallbackForMatchesChange(callback: (match: Match[]) => void): void {
        this.callbackMatches.push(callback);
    }

    public registerCallbackForStatusChange(callback: (status: Status) => void): void {
        this.callbackStatus.push(callback);
    }
}