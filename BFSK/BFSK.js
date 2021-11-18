import Helpers from '../helpers.js';

const h = new Helpers();

export default function BFSK(EB_N0_DB, NO_OF_BITS, BER) {
    const Bk = h.randi([0, 1], NO_OF_BITS); // message
    const Xk = Bk.map((bit) => (bit === 0 ? [1, 0] : [0, 1])); // modulation
    for (let i = 0; i < EB_N0_DB.length; i += 1) {
        const Nk = h.getAWGN(EB_N0_DB[i], [NO_OF_BITS, 2]); // AWGN noise
        const Yk = new Array(NO_OF_BITS).fill(0).map((_, j) => h.sum(Xk[j], Nk[j]));
        const bHat = Yk.map(([bit1, bit2]) => {
            if (bit2 - bit1 <= 0) return 0;
            return 1;
        }); // ML decision rule
        const unchangedBits = bHat.reduce((acc, bit, j) => {
            // eslint-disable-next-line no-param-reassign
            if (bit === Bk[j]) acc += 1;
            return acc;
        }, 0);
        // eslint-disable-next-line no-param-reassign
        BER[i] = 1 - (unchangedBits / NO_OF_BITS);
    }
    return BER;
}
