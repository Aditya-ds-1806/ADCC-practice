// eslint-disable-next-line import/extensions
import Helpers from '../helpers.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = h.linspace(0, 10, 25e-2);
const SER_THEORETICAL = h.getTheoreticalBerBfsk(EB_N0_DB);
const Bk = h.randi([0, 1], NO_OF_BITS); // message
const Xk = Bk.map((bit) => (bit === 0 ? [1, 0] : [0, 1])); // modulation

const SER = new Array(EB_N0_DB.length);

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
    SER[i] = 1 - (unchangedBits / NO_OF_BITS);
}

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, SER_THEORETICAL], [EB_N0_DB, SER]);

document.getElementById('simulation').addEventListener('click', () => h.saveData(EB_N0_DB, SER, 'simulation'));
document.getElementById('theory').addEventListener('click', () => h.saveData(EB_N0_DB, SER_THEORETICAL, 'theory'));
