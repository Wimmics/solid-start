import { Result } from "./Result";
import { Match } from "../match/Match";
import { MatchBase } from "../match/MatchBase";

export class ResultBase implements Result {

    private startTime?: Date;
    private endTime?: Date;
    private totalTime: number;
    private matches: Match[];
    
    constructor() {
        this.totalTime = 0.0;
        this.matches = [];
    }

    protected computeEllapsedTime(startTime: Date, endTime: Date): number {
        let timeDiff: number = endTime.getTime() - startTime.getTime(); //in ms
        timeDiff /= 1000; // strip the ms
        //return Math.round(timeDiff); // get seconds 
        return timeDiff;
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

    public addMatch(user: string, displayString: string): Match {
        const startTime = this.getStartTime();

        if (!startTime)
            throw new Error("Unable to add match.");

        const matchingTime = this.computeEllapsedTime(startTime, new Date());
        const match = new MatchBase(user, displayString, matchingTime);
        this.matches.push(match);
        return match;
    }

    public getMatches(): Match[] {
        return this.matches;
    }

    public setRunning(): void {
        this.startTime = new Date();
    }

    public setTerminated(): void {
        this.endTime = new Date();
        this.setTotalTime();
    }

    private setTotalTime(): void {
        const startTime = this.getStartTime();
        const endTime = this.getEndTime();

        if (!startTime || !endTime)
            throw new Error("Can't compute the total time of the strategy.");

        this.totalTime = this.computeEllapsedTime(startTime, endTime);
    }

}