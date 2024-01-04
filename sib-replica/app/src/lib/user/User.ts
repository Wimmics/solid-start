export default interface User {
    getUri(): string;
    getFirstName(): string;
    getLastName(): string;
    getCity(): string;
    getSkills(): string[];
    toString(): string;
}