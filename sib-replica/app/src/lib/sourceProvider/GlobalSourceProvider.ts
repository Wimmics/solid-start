import { SourceProviderBase } from "./SourceProviderBase";

export class GlobalSourceProvider extends SourceProviderBase {

    public addSkills(skills: string[]): GlobalSourceProvider {
        skills.forEach(skill => this.addSource(`http://localhost:8000/org/indexes/skill/${skill}`));
        return this;
    }

    public addCities(cities: string[]): GlobalSourceProvider {
        cities.forEach(city => this.addSource(`http://localhost:8000/org/indexes/city/${city}`));
        return this;
    }
}