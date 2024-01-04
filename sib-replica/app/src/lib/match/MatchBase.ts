import User from "../user/User";
import { Match } from "./Match";

export class MatchBase implements Match {

    private user: User;
    private matchingTime: number;

    constructor(user: User, matchingTime: number) {
        this.user = user;
        this.matchingTime = matchingTime;
    }

    public getUser(): User {
        return this.user;
    }

    public toString(): string {
        return this.getUser().toString();
    }

    public getMatchingTime(): number {
        return this.matchingTime;
    }
    
}