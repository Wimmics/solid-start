import { Strategy, Targets } from "./Strategy";
import { SourceProvider } from "../sourceProvider/SourceProvider";
import { ResultBase } from "../result/ResultBase";

export class StrategyBase implements Strategy {
    private name: string;
    private description: string;
    private sparqlQuery: string;
    private engine: any;
    private result: ResultBase;
    private sourceProvider: (targets: Targets) => SourceProvider;
    private sources: string[];

    constructor(name: string, description: string, sparqlQuery: string, engine: any, sourceProvider: (targets: Targets) => SourceProvider) {
        this.name = name;
        this.description = description;
        this.sparqlQuery = sparqlQuery;
        this.engine = engine;
        this.result = new ResultBase;
        this.sources = [];
        this.sourceProvider = sourceProvider;
    }

    private setSources(targets: Targets): void {
        this.sources = this.sourceProvider(targets).getSources();
    }

    public getSources(): string[] {
        return this.sources;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    private setRunning(): void {
        console.log(`Strategy ${this.getName()} started.`);
        this.getResult().setRunning();
    }

    private setTerminated(): void {
        this.getResult().setTerminated();
        console.log(`Strategy ${this.getName()} terminated in ${this.getResult().getTotalTime()}s.`);
    }

    protected getBindingResult(binding: any): string {
        return binding.get('user').value;
    }

    public async execute(targets: Targets): Promise<void> {
        this.setSources(targets);
        this.setRunning();

        const bindingsStream = await this.getEngine().queryBindings(this.getSparqlQuery(), {
            lenient: true, // ignore HTTP fails
            sources: this.getSources(),
          });

        bindingsStream.on('data', (binding: any) => {
            const user = binding.get('user').value;
            const displayString = this.getBindingResult(binding);
            this.getResult().addMatch(user, displayString)
            // console.log(`Get result: ${firstName} ${lastName} (${city})`);
            //r.push();
            //update(r);
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
}