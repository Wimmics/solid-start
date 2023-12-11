import { Status } from "../Status";

export default interface Timer {

    start(): void;
    stop(): void;
    getStatus(): Status;
    isReady(): boolean;
    isRunning(): boolean;
    isTerminated(): boolean;
    getStartTime(): Date | undefined;
    getEndTime(): Date | undefined;
    getEllapsedTime(): number;

}