import DomHelpers from '../helpers/DomHelpers.js';
import SimulationHelpers from '../helpers/SimulationHelpers.js';

const S = new SimulationHelpers();
const D = new DomHelpers();

export default function QAM(d, SB_N0_DB, NO_OF_BITS) {
    const NO_OF_SYMBOLS = NO_OF_BITS / 3;
    const M = 8;
    const RIGHT = d / 2 + (M / 4 - 1) * d;
    const LEFT = -RIGHT;
    const Es = 1.5 * (d ** 2);
    const SER = new Array(SB_N0_DB.length);
    const SER_THEORETICAL = S.getTheoreticalSerQam8(SB_N0_DB, Es);
    const constellation = S
        .linspace(LEFT, RIGHT, d)
        .map((point) => [[point, d / 2], [point, -d / 2]])
        .flat();
    const Bk = S.randi([0, 1], NO_OF_BITS); // message
    const Sk = Bk.reduce((acc, bit, i) => { // modulation
        if (i % 3 === 0) {
            const tribit = [bit];
            acc.push(tribit);
        } else {
            acc[acc.length - 1].push(bit);
        }
        return acc;
    }, []).map((tribit) => constellation[parseInt(tribit.join(''), 2)]);
    for (let i = 0; i < SB_N0_DB.length; i += 1) {
        const Nk = S.getAWGN(SB_N0_DB[i], [NO_OF_SYMBOLS, 2]); // AWGN noise
        const Yk = new Array(NO_OF_SYMBOLS).fill(0).map((_, j) => S.sum(Sk[j], Nk[j]));
        const sHat = Yk.map(([x1, y1]) => {
            let shortestDistance = Infinity;
            let closestPoint;
            constellation.forEach(([x2, y2]) => {
                const distance = Math.hypot(x2 - x1, y2 - y1);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    closestPoint = [x2, y2];
                }
            });
            return S.dec2bin(D.indexOf(constellation, closestPoint), 3).split('').map((char) => Number(char));
        });
        const unchangedSymbols = sHat.reduce((acc, symbol, j) => {
            const s = Bk.slice(3 * j, 3 * j + 3);
            // eslint-disable-next-line no-param-reassign
            if (symbol.toString() === s.toString()) acc += 1;
            return acc;
        }, 0);
        SER[i] = 1 - (unchangedSymbols / NO_OF_SYMBOLS);
    }
    return [SER, SER_THEORETICAL];
}
