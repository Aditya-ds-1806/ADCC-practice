import Helpers from '../helpers.js';

const h = new Helpers();

export default function QPSK(SB_N0_DB, NO_OF_BITS) {
    const NO_OF_SYMBOLS = NO_OF_BITS / 2;
    const SER = new Array(SB_N0_DB.length);
    const SER_THEORETICAL = h.getTheoreticalSerQpsk(SB_N0_DB);
    const Bk = h.randi([0, 1], NO_OF_BITS); // message
    const Sk = Bk.reduce((acc, bit, i) => { // modulation
        if (i % 2 === 0) {
            const dibit = [bit === 0 ? Math.SQRT1_2 : -Math.SQRT1_2];
            acc.push(dibit);
        } else {
            acc[acc.length - 1].push(bit === 0 ? Math.SQRT1_2 : -Math.SQRT1_2);
        }
        return acc;
    }, []);
    for (let i = 0; i < SB_N0_DB.length; i += 1) {
        const Nk = h.getAWGN(SB_N0_DB[i], [NO_OF_SYMBOLS, 2]); // AWGN noise
        const Yk = new Array(NO_OF_SYMBOLS).fill(0).map((_, j) => h.sum(Sk[j], Nk[j]));
        const sHat = Yk.map(([bit1, bit2]) => {
            if (bit1 >= 0 && bit2 >= 0) return [0, 0];
            if (bit1 <= 0 && bit2 >= 0) return [1, 0];
            if (bit1 <= 0 && bit2 <= 0) return [1, 1];
            return [0, 1];
        }); // ML decision rule
        const unchangedSymbols = sHat.reduce((acc, [bit1, bit2], j) => {
            // eslint-disable-next-line no-param-reassign
            if (bit1 === Bk[2 * j] && bit2 === Bk[2 * j + 1]) acc += 1;
            return acc;
        }, 0);
        SER[i] = 1 - (unchangedSymbols / NO_OF_SYMBOLS);
    }
    return [SER, SER_THEORETICAL];
}
