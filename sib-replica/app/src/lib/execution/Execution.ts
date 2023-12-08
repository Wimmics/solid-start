import { Status } from "../Status";
import { Strategy, Targets } from "../strategy/Strategy";

export interface Execution {
    getStrategies(): Strategy[];
    run(targets: Targets): Promise<void>;
    isRunning(): boolean;
    isTerminated(): boolean;
    getStatus(): Status;
}