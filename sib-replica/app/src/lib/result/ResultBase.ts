import { Result } from "./Result";
import { Status } from "../Status";
import { Match } from "../match/Match";
import { MatchBase } from "../match/MatchBase";

export class ResultBase implements Result {

    private startTime?: Date;
    private endTime?: Date;
    private totalTime: number;
    private status: Status;
    private matches: Match[];
    private callbackNewMatch: ((match: Match) => void)[];
    private callbackStatus: ((status: Status) => void)[];

    constructor() {
        this.totalTime = 0.0;
        this.status = Status.READY;
        this.matches = [];
        this.callbackNewMatch = [];
        this.callbackStatus = [];
    }

    protected computeEllapsedTime(startTime: Date, endTime: Date): number {
        let timeDiff: number = endTime.getTime() - startTime.getTime(); //in ms
        timeDiff /= 1000; // strip the ms
        return Math.round(timeDiff); // get seconds 
    }

    public getStartTime(): Date | undefined {
        return this.startTime;
    }

    public getEndTime(): Date | undefined {
        return this.endTime;
    }

    public getFirstResult(): number {
        throw new Error("Method not implemented.");
    }

    public getRequestsNumber(): number {
        throw new Error("Method not implemented.");
    }
    
    public getTotalTime(): number {
        return this.totalTime;
    }

    public getStatus(): Status {
        return this.status;
    }

    public addMatch(user: string, displayString: string): void {
        const startTime = this.getStartTime();

        if (!startTime)
            throw new Error("Unable to add match.");

        const matchingTime = this.computeEllapsedTime(startTime, new Date());
        const match = new MatchBase(user, displayString, matchingTime);
        this.matches.push(match);
        this.callbackNewMatch.forEach(callback => callback(match))
    }

    public registerCallbackForNewMatch(callback: (match: Match) => void): void {
        this.callbackNewMatch.push(callback);
    }

    public registerCallbackForStatus(callback: (status: Status) => void): void {
        this.callbackStatus.push(callback);
    }

    public getMatches(): Match[] {
        return this.matches;
    }

    private setStatus(status: Status): void {
        this.status = status;
        this.callbackStatus.forEach(callback => callback(status));
    }

    public setRunning(): void {
        this.startTime = new Date();
        this.setStatus(Status.RUNNING);
    }

    public setTerminated(): void {
        this.endTime = new Date();
        this.setTotalTime();
        this.setStatus(Status.TERMINATED);
    }

    private setTotalTime(): void {
        const startTime = this.getStartTime();
        const endTime = this.getEndTime();

        if (!startTime || !endTime)
            throw new Error("Can't compute the total time of the strategy.");

        this.totalTime = this.computeEllapsedTime(startTime, endTime);
    }

}