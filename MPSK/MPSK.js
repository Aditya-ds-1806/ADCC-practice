import DomHelpers from '../helpers/DomHelpers.js';
import SimulationHelpers from '../helpers/SimulationHelpers.js';

const D = new DomHelpers();
const S = new SimulationHelpers();

export default function MPSK(M, SB_N0_DB, NO_OF_SYMBOLS) {
    const L = Math.log2(M);
    const NO_OF_BITS = L * NO_OF_SYMBOLS;
    const SER = new Array(SB_N0_DB.length);
    const SER_THEORETICAL = S.getTheoreticalSerMpsk(SB_N0_DB, M);

    const phases = new Array(M).fill(0).map((_, i) => (2 * i * Math.PI) / M);
    const constellation = phases.map((phase) => [Math.cos(phase), Math.sin(phase)]);
    const Bk = S.randi([0, 1], NO_OF_BITS); // message
    const Sk = Bk.reduce((acc, bit, i) => { // modulation
        if (i % L === 0) {
            const lbit = [bit];
            acc.push(lbit);
        } else {
            acc[acc.length - 1].push(bit);
        }
        return acc;
    }, []).map((s) => constellation[parseInt(s.join(''), 2)]);
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
            return S.dec2bin(D.indexOf(constellation, closestPoint), L).split('').map((char) => Number(char));
        }); // ML decision rule
        const unchangedSymbols = sHat.reduce((acc, symbol, j) => {
            const s = Bk.slice(L * j, L * j + L);
            // eslint-disable-next-line no-param-reassign
            if (symbol.toString() === s.toString()) acc += 1;
            return acc;
        }, 0);
        // eslint-disable-next-line no-param-reassign
        SER[i] = 1 - (unchangedSymbols / NO_OF_SYMBOLS);
    }
    return [SER, SER_THEORETICAL];
}
