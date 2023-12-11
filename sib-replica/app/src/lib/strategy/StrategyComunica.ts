import { SourceProvider } from "../sourceProvider/SourceProvider";
import { Targets } from "./Strategy";
import { StrategyBase } from "./StrategyBase";

/**
 * A function that takes a Comunica binding result and returns
 * a string representing this binding result.
 */
export type MatchDisplay = (binding: any) => string;

/**
 * A `StrategyBase` that uses Comunica to find results.
 */
export default class StrategyComunica extends StrategyBase {
    private engine: any;
    private matchDisplay?: MatchDisplay;

    /**
     * @inheritdoc
     * @param matchDisplay A function to customize the display of a matched user.
     */
    constructor(name: string, description: string, sparqlQuery: string, engine: any, sourceProvider: (targets: Targets) => SourceProvider, matchDisplay?: (binding: any) => string) {
        super(name, description, sparqlQuery, sourceProvider);
        this.engine = engine;
        this.matchDisplay = matchDisplay;
    }

    protected getMatchDisplay(): MatchDisplay | undefined {
        return this.matchDisplay;
    }

    protected getBindingResult(binding: any): string {
        return binding.get('user').value;
    }

    public async execute(targets: Targets): Promise<void> {
        super.execute(targets);
        this.setRunning();
        
        const bindingsStream = await this.getEngine().queryBindings(this.getSparqlQuery(), {
            lenient: true, // ignore HTTP fails
            sources: this.getSources(),
        });
        
        bindingsStream.on('data', (binding: any) => {
            const user = binding.get('user').value;
            const displayString = this.getMatchDisplay()? (this.getMatchDisplay()!)(binding): user;
            this.addMatchToResults(user, displayString);
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

    protected getEngine(): any {
        return this.engine;
    }

}