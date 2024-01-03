import { Targets } from "./Strategy";
import { SourceProvider } from "../sourceProvider/SourceProvider";
import { StrategyBase } from "./StrategyBase";

export type SourceProviderFactory = (targets: Targets) => SourceProvider;

/**
 * An indexing strategy that does nothing.
 * It should be inherited to implement concreate strategies.
 * Subclasses must override the `execute` method after calling the one from super.
 * 
 * This class provides somes callbacks to get notified when some values change (status, matches).
 */
export class StrategyBaseSparql extends StrategyBase {
    private sparqlQuery: string;
    private sourceProviderFactory: SourceProviderFactory;
    private sources: string[];

    /**
     * Constructs a new `StrategyBase`.
     * @param name The name of the strategy.
     * @param description The description of the strategy.
     * @param sparqlQuery The SPARQL query that the strategy will process.
     * @param sourceProviderFactory A function to get a `SourceProvider` given some targets.
     */
    constructor(name: string, description: string, sparqlQuery: string, sourceProviderFactory: SourceProviderFactory) {
        super(name, description);
        this.sparqlQuery = sparqlQuery;
        this.sources = [];
        this.sourceProviderFactory = sourceProviderFactory;
    }

    protected getSourceProvider(targets: Targets): SourceProvider {
        return this.sourceProviderFactory(targets);
    }

    protected setSources(targets: Targets): void {
        this.sources = this.getSourceProvider(targets).getSources();
    }

    public getSources(): string[] {
        return this.sources;
    }

    public getTargetedSources(targets: Targets): string[] {
        return this.getSourceProvider(targets).getSources();
    }

    public async execute(targets: Targets): Promise<void> {
        await super.execute(targets);
        this.setSources(targets);
        return Promise.resolve();
    }

    public getSparqlQuery(): string {
        return this.sparqlQuery;
    }

}