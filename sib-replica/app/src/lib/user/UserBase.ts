import User from "./User";

export default class UserBase implements User {

    private uri: string;
    private firstName: string;
    private lastName: string;
    private city: string;
    private skills: string[];

    constructor(uri: string, firstName: string = "", lastName: string = "", city: string = "", skills: string[] = []) {
        this.uri = uri;
        this.firstName = firstName;
        this.lastName = lastName;
        this.city = city;
        this.skills = skills;
    }

    public addSkill(skill: string): void {
        this.skills.push(skill);
    }

    public getUri(): string {
        return this.uri;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getCity(): string {
        return this.city;
    }

    public getSkills(): string[] {
        return this.skills;
    }

    public toString(): string {
        return `${this.getFirstName()} ${this.getLastName()} (${this.getCity()})`;
    }
    
}