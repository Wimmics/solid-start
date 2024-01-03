import { Match } from "../match/Match";
import { Result } from "../result/Result";
import { SourceProvider } from "../sourceProvider/SourceProvider";
import { Strategy, Targets } from "./Strategy";
import { StrategyBase } from "./StrategyBase";

/**
 * A function that takes a Comunica binding result and returns
 * a string representing this binding result.
 */
//export type TargetsFilter = (targets: Targets) => Targets;
export type ResultFilter = (targets: Targets, match: Match) => boolean;

/**
 * A `StrategyBase` that uses Comunica to find results.
 */
export default class StrategyFilter extends StrategyBase {
    private strategy: Strategy;
    //private strategyTargetsFilter: TargetsFilter;
    private resultFilter: ResultFilter;

    /**
     * @inheritdoc
     * @param matchDisplay A function to customize the display of a matched user.
     */
    constructor(name: string, description: string, strategy: Strategy, resultFilter: ResultFilter) {
        super(name, description);
        this.strategy = strategy;
        //this.strategyTargetsFilter = strategyTargetsFilter;
        this.resultFilter = resultFilter;
    }

    public getStrategy(): Strategy {
        return this.strategy;
    }

    public getResultFilter(): ResultFilter {
        return this.resultFilter;
    }

    public async execute(targets: Targets): Promise<void> {
        await super.execute(targets);
        this.setRunning();
        await this.getStrategy().execute(targets);
        const result = this.getStrategy().getResult();
        result.getMatches().forEach((match: Match) => {
            if (this.getResultFilter()(targets, match))
                this.addMatchToResults(match.getUser(), match.toString());
        })
        this.setTerminated();
        return Promise.resolve();
    }

}