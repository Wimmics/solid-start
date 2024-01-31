import { SourceProviderBase } from "./SourceProviderBase";

export class FederatedSourceProvider extends SourceProviderBase {

    public addSkills(skills: string[]): FederatedSourceProvider {
        skills.forEach(skill => this.addSource(`http://localhost:8000/org/indexes/skill/${skill}`));
        return this;
    }

    public addCities(cities: string[]): FederatedSourceProvider {
        cities.forEach(city => this.addSource(`http://localhost:8000/org/indexes/city/${city}`));
        return this;
    }
}