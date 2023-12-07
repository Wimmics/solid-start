import { SourceProviderBase } from "./SourceProviderBase";

export class LocalSourceProvider extends SourceProviderBase {

    private instanceNumber: number;

    constructor(instanceNumber: number) {
        super();
        this.instanceNumber = instanceNumber;
    }

    public addSkills(skills: string[]): LocalSourceProvider {
        skills.forEach(skill => {
            for (let i = 1; i <= this.instanceNumber; i++) { 
                this.addSource(`http://localhost:${8000 + i}/indexes/skill/${skill}`)
            }
        });
        return this;
    }

    public addCities(cities: string[]): LocalSourceProvider {
        cities.forEach(city => {
            for (let i = 1; i <= this.instanceNumber; i++) { 
                this.addSource(`http://localhost:${8000 + i}/indexes/city/${city}`)
            }
        });
        return this;
    }
}