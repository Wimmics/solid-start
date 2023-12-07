import { Match } from "./Match";

export class MatchBase implements Match {

    private user: string;
    private displayString: string;
    private matchingTime: number;

    constructor(user: string, displayString: string, matchingTime: number) {
        this.user = user;
        this.displayString = displayString;
        this.matchingTime = matchingTime;
    }

    public getUser(): string {
        return this.user;
    }

    public toString(): string {
        return this.displayString;
    }

    public getMatchingTime(): number {
        return this.matchingTime;
    }
    
}