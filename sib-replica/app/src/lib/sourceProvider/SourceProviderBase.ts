import { SourceProvider } from "./SourceProvider";

export class SourceProviderBase implements SourceProvider {

    private sources: string[];

    constructor() {
        this.sources = [];
    }

    public addSource(source: string): void {
        this.sources.push(source);
    }

    public getSources(): string[] {
        return this.sources;
    }

    public sourcesCount(): number {
        return this.sources.length;
    }

}