import { Match } from "../match/Match";
import { Strategy, Targets } from "./Strategy";
import { StrategyBase } from "./StrategyBase";

export type ResultFilter = (targets: Targets, match: Match) => boolean;

export default class StrategyFilter extends StrategyBase {
    private strategy: Strategy;
    private resultFilter: ResultFilter;

    constructor(name: string, description: string, strategy: Strategy, resultFilter: ResultFilter) {
        super(name, description);
        this.strategy = strategy;
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
                this.addMatchToResults(match.getUser());
        })
        this.setTerminated();
        return Promise.resolve();
    }

}