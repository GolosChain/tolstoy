import React from 'react';

import WitnessesString from 'src/app/containers/Witnesses/WitnessesStrings/WitnessesString';

export default function WitnessesStrings({ sortedWitnesses, witnessVotes, totalVestingShares }) {
    let rank = 1;
    const builtWitnessesStrings = sortedWitnesses.map(item => (
        <WitnessesString
            key={item.get('owner')}
            rank={rank++}
            item={item}
            witnessVotes={witnessVotes}
            totalVestingShares={totalVestingShares}
        />
    ));
    return builtWitnessesStrings.toArray();
}
