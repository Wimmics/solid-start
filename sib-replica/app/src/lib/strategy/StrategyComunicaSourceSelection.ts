import { QueryEngine } from "@comunica/query-sparql";
import { SourceProvider } from "../sourceProvider/SourceProvider";
import User from "../user/User";
import UserBase from "../user/UserBase";
import { Targets } from "./Strategy";
import { DynamicSparqlQuery } from "./StrategyBaseSparql";
import StrategyComunica from "./StrategyComunica";
import { SourceProviderBase } from "../sourceProvider/SourceProviderBase";

/**
 * A `StrategyBase` that uses Comunica to find results.
 */
export default class StrategyComunicaSourceSelection extends StrategyComunica {

    private sparqlQueryFromSourceSelection: string | DynamicSparqlQuery;

    /**
     * @inheritdoc
     */
    constructor(name: string, description: string, sourceSelectionSparqlQuery: string | DynamicSparqlQuery, sparqlQueryFromSourceSelection: string | DynamicSparqlQuery, engine: any, sourceProvider: (targets: Targets) => SourceProvider) {
        super(name, description, sourceSelectionSparqlQuery, engine, sourceProvider);
        this.sparqlQueryFromSourceSelection = sparqlQueryFromSourceSelection;
    }

    public async execute(targets: Targets): Promise<void> {
        this.setSources(targets);
        this.setRunning();
        
        const bindingsStream = await this.getEngine().queryBindings(this.getSparqlQuery(targets), {
            lenient: true, // ignore HTTP fails
            sources: this.getSources(),
        });

        const promises: Promise<void>[] = [];
        
        bindingsStream.on('data', (binding: any) => {
            //console.log(binding.toString());

            const skillIndex: string = binding.has("instancesSkill")? binding.get('instancesSkill').value: "unknown";
            const cityIndex: string = binding.has("instancesCity")? binding.get('instancesCity').value: "unknown";

            const sources: string[] = [];

            if (skillIndex !== "unknown") {
                console.log("Source selection found source: ", skillIndex);
                sources.push(skillIndex)
            }

            if (cityIndex !== "unknown") {
                console.log("Source selection found source: ", cityIndex);
                sources.push(cityIndex)
            }

            const strategy = new StrategyComunica("", "", this.sparqlQueryFromSourceSelection, new QueryEngine(), (t: Targets) => new SourceProviderBase().addSourceAll(sources));
            strategy.registerCallbackForMatchesChange((matches) => matches.forEach(match => this.addMatchToResults(match.getUser())));
            promises.push(strategy.execute(targets));
          });
      
        return new Promise<void>((resolve, reject) => {
            bindingsStream.on('end', async () => {
                await Promise.all(promises);
                this.setTerminated();
                resolve();
            });
            bindingsStream.on('error', (error: Error) => {
                reject(error);
            });
        });
    }

}