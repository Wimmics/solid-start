import { SourceProviderBase } from "./SourceProviderBase";

export class CentralizedSourceProvider extends SourceProviderBase {

    public addSkills(skills: string[]): CentralizedSourceProvider {
        skills.forEach(skill => this.addSource(`http://localhost:8000/org/indexes/skill/${skill}`));
        return this;
    }

    public addCities(cities: string[]): CentralizedSourceProvider {
        cities.forEach(city => this.addSource(`http://localhost:8000/org/indexes/city/${city}`));
        return this;
    }
}