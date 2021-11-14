// eslint-disable-next-line import/extensions
import Helpers from '../helpers.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const NO_OF_SYMBOLS = NO_OF_BITS / 2;
const EB_N0_DB = h.linspace(0, 10, 25e-2);
const SER_THEORETICAL = h.getTheoreticalSerQpsk(EB_N0_DB);
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

const SER = new Array(EB_N0_DB.length);

for (let i = 0; i < EB_N0_DB.length; i += 1) {
    const Nk = h
        .randn(NO_OF_BITS)
        .map((N) => N / Math.sqrt(2 * (10 ** (EB_N0_DB[i] / 10))))
        .reduce((acc, N, j) => {
            if (j % 2 === 0) {
                const diNoise = [N];
                acc.push(diNoise);
            } else {
                acc[acc.length - 1].push(N);
            }
            return acc;
        }, []);
    const Yk = new Array(NO_OF_BITS / 2).fill(0).map((_, j) => h.sum(Sk[j], Nk[j]));
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

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, SER_THEORETICAL], [EB_N0_DB, SER]);

document.getElementById('simulation').addEventListener('click', () => h.saveData(EB_N0_DB, SER, 'simulation'));
document.getElementById('theory').addEventListener('click', () => h.saveData(EB_N0_DB, SER_THEORETICAL, 'theory'));
