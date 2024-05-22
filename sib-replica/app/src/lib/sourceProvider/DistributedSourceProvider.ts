import { SourceProviderBase } from "./SourceProviderBase";

export class DistributedSourceProvider extends SourceProviderBase {

    private instanceNumber: number;

    constructor(instanceNumber: number) {
        super();
        this.instanceNumber = instanceNumber;
    }

    public addSkills(skills: string[]): DistributedSourceProvider {
        skills.forEach(skill => {
            for (let i = 1; i <= this.instanceNumber; i++) { 
                this.addSource(`http://localhost:${8000 + i}/indexes/skill/${skill}`)
            }
        });
        return this;
    }

    public addCities(cities: string[]): DistributedSourceProvider {
        cities.forEach(city => {
            for (let i = 1; i <= this.instanceNumber; i++) { 
                this.addSource(`http://localhost:${8000 + i}/indexes/city/${city}`)
            }
        });
        return this;
    }

    public addMetaIndexes(): DistributedSourceProvider {
        for (let i = 1; i <= this.instanceNumber; i++) { 
            this.addSource(`http://localhost:${8000 + i}/indexes/root`)
        };
        return this;
    }
}