import { Result } from "./Result";
import { Match } from "../match/Match";
import { MatchBase } from "../match/MatchBase";
import Timer from "../timer/Timer";
import TimerBase from "../timer/TimerBase";
import Utils from "../timer/Utils";
import User from "../user/User";

export class ResultBase implements Result {

    private timerTotalTime: Timer;
    private matches: Match[];
    
    constructor() {
        this.timerTotalTime = new TimerBase();
        this.matches = [];
    }

    public startTotalTimeTimer(): void {
        this.getTimerTotalTime().start();
    }

    public stopTotalTimeTimer(): void {
        this.getTimerTotalTime().stop();
    }

    private getTimerTotalTime(): Timer {
        return this.timerTotalTime;
    }

    public getStartTime(): Date | undefined {
        return this.getTimerTotalTime().getStartTime();
    }

    public getEndTime(): Date | undefined {
        return this.getTimerTotalTime().getStartTime();
    }

    public getFirstResult(): number {
        throw new Error("Method not implemented.");
    }

    public getRequestsNumber(): number {
        throw new Error("Method not implemented.");
    }
    
    public getTotalTime(): number {
        return this.getTimerTotalTime().getEllapsedTime();
    }

    public addMatch(user: User): Match {
        const startTime = this.getStartTime();

        if (!startTime)
            throw new Error("Unable to add match.");

        const matchingTime = Utils.computeEllapsedTime(startTime, new Date());
        const match = new MatchBase(user, matchingTime);
        this.matches.push(match);
        return match;
    }

    public getMatches(): Match[] {
        return this.matches;
    }

}