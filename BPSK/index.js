// eslint-disable-next-line import/extensions
import Helpers from '../helpers.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = h.linspace(0, 10, 25e-2);
const BER_THEORETICAL = h.getTheoreticalBER(EB_N0_DB);
const Bk = h.randi([0, 1], NO_OF_BITS); // message
const Xk = Bk.map((bit) => (bit === 0 ? 1 : -1)); // modulation
const BER = new Array(EB_N0_DB.length).fill(0);

for (let i = 0; i < EB_N0_DB.length; i += 1) {
    const Nk = h
        .randn(NO_OF_BITS)
        .map((N) => N / Math.sqrt(2 * (10 ** (EB_N0_DB[i] / 10)))); // AWGN Noise
    const Yk = h.sum(Xk, Nk);
    const bHat = Yk.map((point) => Number(point < 0)); // ML decision rule
    const unchangedBits = Bk.reduce((acc, bit, j) => {
        // eslint-disable-next-line no-param-reassign
        if (bit === bHat[j]) acc += 1;
        return acc;
    }, 0);
    BER[i] = 1 - (unchangedBits / NO_OF_BITS);
}

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);

document.getElementById('simulation').addEventListener('click', () => h.saveData(EB_N0_DB, BER, 'simulation'));
document.getElementById('theory').addEventListener('click', () => h.saveData(EB_N0_DB, BER_THEORETICAL, 'theory'));
