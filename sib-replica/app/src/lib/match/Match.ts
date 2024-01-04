import User from "../user/User";

export interface Match {
    getUser(): User;
    getMatchingTime(): number;
}