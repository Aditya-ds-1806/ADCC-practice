import Helpers from '../helpers.js';

const h = new Helpers();

export default function BPSK(EB_N0_DB, NO_OF_BITS, BER) {
    const Bk = h.randi([0, 1], NO_OF_BITS); // message
    const Xk = Bk.map((bit) => (bit === 0 ? 1 : -1)); // modulation
    for (let i = 0; i < EB_N0_DB.length; i += 1) {
        const Nk = h.getAWGN(EB_N0_DB[i], [NO_OF_BITS, 1]); // AWGN Noise
        const Yk = h.sum(Xk, Nk);
        const bHat = Yk.map((point) => Number(point < 0)); // ML decision rule
        const unchangedBits = Bk.reduce((acc, bit, j) => {
            // eslint-disable-next-line no-param-reassign
            if (bit === bHat[j]) acc += 1;
            return acc;
        }, 0);
        // eslint-disable-next-line no-param-reassign
        BER[i] = 1 - (unchangedBits / NO_OF_BITS);
    }
    return BER;
}
