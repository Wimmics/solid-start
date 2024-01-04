import { SourceProvider } from "../sourceProvider/SourceProvider";
import User from "../user/User";
import UserBase from "../user/UserBase";
import { Targets } from "./Strategy";
import { StrategyBaseSparql } from "./StrategyBaseSparql";

/**
 * A `StrategyBase` that uses Comunica to find results.
 */
export default class StrategyComunica extends StrategyBaseSparql {
    private engine: any;

    /**
     * @inheritdoc
     */
    constructor(name: string, description: string, sparqlQuery: string, engine: any, sourceProvider: (targets: Targets) => SourceProvider) {
        super(name, description, sparqlQuery, sourceProvider);
        this.engine = engine;
    }

    protected getBindingResult(binding: any): string {
        return binding.get('user').value;
    }

    public async execute(targets: Targets): Promise<void> {
        await super.execute(targets);
        this.setRunning();
        
        const bindingsStream = await this.getEngine().queryBindings(this.getSparqlQuery(), {
            lenient: true, // ignore HTTP fails
            sources: this.getSources(),
        });

        let foundUsers: User[] = [];
        
        bindingsStream.on('data', (binding: any) => {
            const userUri: string = binding.get('user').value;
            const skill: string = binding.get('skills').value;

            const foundUser = foundUsers.find((user: User) => user.getUri() === userUri);

            if (foundUser) {
                (foundUser as UserBase).addSkill(skill);
            }

            else {
                const user = new UserBase(
                    userUri,
                    binding.get('firstName').value ?? "",
                    binding.get('lastName').value ?? "",
                    binding.get('city').value ?? "",
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