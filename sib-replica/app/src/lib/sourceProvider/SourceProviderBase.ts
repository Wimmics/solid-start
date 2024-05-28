import { SourceProvider } from "./SourceProvider";

export class SourceProviderBase implements SourceProvider {

    private sources: string[];

    constructor() {
        this.sources = [];
    }

    public addSource(source: string): SourceProviderBase {
        this.sources.push(source);
        return this;
    }

    public addSourceAll(sources: string[]): SourceProviderBase {
        sources.forEach(source => this.sources.push(source));
        return this;
    }

    public getSources(): string[] {
        return this.sources;
    }

    public sourcesCount(): number {
        return this.sources.length;
    }

}