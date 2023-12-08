import { Status } from "../Status";
import { Strategy, Targets } from "../strategy/Strategy";
import { ExecutionBase } from "./ExecutionBase";

export class ParralelExecution extends ExecutionBase {

    private status: Status;

    constructor(strategies: Strategy[]) {
        super(strategies);
        this.status = Status.READY;
    }

    // TO BE TESTED
    public async run(targets: Targets): Promise<void> {
        this.status = Status.RUNNING;
        const promises = this.getStrategies().map(async (strategy) => await strategy.execute(targets));
        return Promise.all(promises).then(() => { this.status = Status.TERMINATED });
    }

    public getStatus(): Status {
        return this.status;
    }

}