import { Status } from "../Status";
import { Strategy, Targets } from "../strategy/Strategy";
import { ExecutionBase } from "./ExecutionBase";

export class SequentialExecution extends ExecutionBase {

    private status: Status;

    constructor(strategies: Strategy[]) {
        super(strategies);
        this.status = Status.READY;
    }

    public async run(targets: Targets): Promise<void> {
        this.status = Status.RUNNING;
        for await (const strategy of this.getStrategies())
            await strategy.execute(targets);
        this.status = Status.TERMINATED
        return Promise.resolve();
    }

    public getStatus(): Status {
        return this.status;
    }

}