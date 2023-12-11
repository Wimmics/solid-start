import { Status } from "../Status";
import Timer from "./Timer";
import Utils from "./Utils";

export default class TimerBase implements Timer {

    private startTime?: Date;
    private endTime?: Date;
    private status: Status;

    constructor() {
        this.status = Status.READY;
    }

    public isReady(): boolean {
        return this.getStatus() === Status.READY;
    }

    public isRunning(): boolean {
        return this.getStatus() === Status.RUNNING;
    }

    public isTerminated(): boolean {
        return this.getStatus() === Status.TERMINATED;
    }

    private setStartTime(startTime: Date): void {
        this.startTime = startTime;
    }

    private setEndTime(endTime: Date): void {
        this.endTime = endTime;
    }

    private setStatus(status: Status): void {
        this.status = status;
    }

    public start(): void {
        if (!this.isReady())
            throw new Error("The timer has already been started.")
        this.setStartTime(new Date());
        this.setStatus(Status.RUNNING);
    }

    public stop(): void {
        if (!this.isRunning())
            throw new Error("Can't stop the timer because it has not been started.")
        this.setEndTime(new Date());
        this.setStatus(Status.TERMINATED);
    }

    public getStartTime(): Date | undefined {
        return this.startTime;
    }

    public getEndTime(): Date | undefined {
        return this.endTime;
    }

    public getStatus(): Status {
        return this.status;
    }

    public getEllapsedTime(): number {
        const startTime = this.getStartTime();
        const endTime = this.getEndTime();

        if (!startTime || !endTime)
            return 0.0;

        return Utils.computeEllapsedTime(startTime, endTime);
    }

}