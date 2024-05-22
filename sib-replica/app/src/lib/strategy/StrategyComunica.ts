import { SourceProvider } from "../sourceProvider/SourceProvider";
import User from "../user/User";
import UserBase from "../user/UserBase";
import { Targets } from "./Strategy";
import { DynamicSparqlQuery, StrategyBaseSparql } from "./StrategyBaseSparql";

/**
 * A `StrategyBase` that uses Comunica to find results.
 */
export default class StrategyComunica extends StrategyBaseSparql {
    private engine: any;

    /**
     * @inheritdoc
     */
    constructor(name: string, description: string, sparqlQuery: string | DynamicSparqlQuery, engine: any, sourceProvider: (targets: Targets) => SourceProvider) {
        super(name, description, sparqlQuery, sourceProvider);
        this.engine = engine;
    }

    protected getBindingResult(binding: any): string {
        return binding.get('user').value;
    }

    public async execute(targets: Targets): Promise<void> {
        await super.execute(targets);
        this.setRunning();
        
        const bindingsStream = await this.getEngine().queryBindings(this.getSparqlQuery(targets), {
            lenient: true, // ignore HTTP fails
            sources: this.getSources(),
        });

        let foundUsers: User[] = [];
        
        bindingsStream.on('data', (binding: any) => {
            //console.log(binding.toString());

            const userUri: string = binding.has("user")? binding.get('user').value: "unknown";
            const skill: string = binding.has("skills")? binding.get('skills').value: "unknown";

            const foundUser = foundUsers.find((user: User) => user.getUri() === userUri);

            if (foundUser) {
                (foundUser as UserBase).addSkill(skill);
            }

            else {
                const user = new UserBase(
                    userUri,
                    binding.has("firstName")? binding.get('firstName').value: "unknown",
                    binding.has("lastName")? binding.get('lastName').value : "unknown",
                    binding.has("city")? binding.get('city').value: "unknown",
                    skill ? [skill]: []
                );
                this.addMatchToResults(user);
                foundUsers.push(user);
            }
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