import { StrategyBase } from "./StrategyBase";
const QueryEngine = require('@comunica/query-sparql').QueryEngine;

export const none = "";

/*export class GlobalIndexStrategy extends StrategyBase {

    constructor() {
        super(
            "globalIndex",
            "",
            `SELECT DISTINCT ?user WHERE {
                ?index a <http://example.org#SkillIndex>;
                <http://example.org#entry> ?user
            } LIMIT 100`, 
            new QueryEngine,
            () => null
        )
    }

    protected getBindingResult(binding: any): string {
        const firstName = binding.get('firstName').value;
        const lastName = binding.get('lastName').value;
        const city = binding.get('city').value;
        return `${firstName} ${lastName} (${city})`;
    }

}
*/