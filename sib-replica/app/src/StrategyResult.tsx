import { useEffect, useState } from 'react';
import { Strategy } from "./lib/strategy/Strategy";
import { Match } from './lib/match/Match';
import { Status } from './lib/Status';

export function StrategyResult(props: {strategy: Strategy}) {

    const { strategy } = props;

    const [matches, setMatches] = useState<Match[]>([]);
    const [status, setStatus] = useState<Status>(Status.READY);

    useEffect(() => {
        strategy.getResult().registerCallbackForStatus((status) => setStatus(status));
        strategy.getResult().registerCallbackForNewMatch((match) => setMatches(strategy.getResult().getMatches()));
      }, []);

    return (
        <table>
            <tbody>
                <tr>
                    <th></th>
                    <th>{strategy.getName()}</th>
                </tr>

                <tr>
                    <th>Status</th>
                    <td>{status}</td>
                </tr>

                <tr>
                    <th>Time</th>
                    <td>{strategy.getResult().getTotalTime()}s</td>
                </tr>

                <tr>
                    <th>Queried sources</th>
                    <td>?</td>
                </tr>

                <tr>
                    <th>Results</th>
                    <td>
                        <ol>
                        {matches.map((match: Match, i: number) => <li key={i}>{match.toString()}</li>)}
                        </ol>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}