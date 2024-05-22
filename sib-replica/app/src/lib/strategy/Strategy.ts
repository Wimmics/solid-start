import { Result } from "../result/Result";
import { Status } from "../Status";
import { Match } from "../match/Match";

/**
 * An indexing strategy.
 */
export interface Strategy {
    /**
     * Returns the name of the strategy.
     */
    getName(): string;

    /**
     * Returns the description of the strategy.
     */
    getDescription(): string;

    /**
     * Returns the SPARQL query that will be executed by the strategy.
     */
    getSparqlQuery(targets: Targets): string;

    /**
     * Executes the strategy to find users corresponding to the targets.
     * @param targets The targets to find (skills and cities).
     */
    execute(targets: Targets): Promise<void>;

    /**
     * Returns a list of URL that the strategy was expected to fetch during its execution.
     * @param targets The targets to find (skills and cities).
     */
    getTargetedSources(targets: Targets): string[];

    /**
     * Tells if the strategy is ready to be executed.
     */
    isReady(): boolean;

    /**
     * Tells if the strategy is running its execution.
     */
    isRunning(): boolean;

    /**
     * Tells if the strategy has finished its execution.
     */
    isTerminated(): boolean;

    /**
     * Returns the results of the strategy (totalTime, matches).
     */
    getResult(): Result;

    /**
     * Be notified when the strategy status changes.
     * @param callback The function to call when status changes.
     * @param priority The priority level for the callback.
     */
    registerCallbackForStatusChange(callback: (status: Status) => void, priority?: number): void;

    /**
     * Be notified when the strategy matches change.
     * @param callback The function to call when matches change (users).
     * @param priority The priority level for the callback.
     */
    registerCallbackForMatchesChange(callback: (match: Match[]) => void, priority?: number): void;
}

/**
 * Holds the skills and cities that are passed to a Strategy at execution time.
 */
export interface Targets {
    skills: string[];
    cities: string[];
}