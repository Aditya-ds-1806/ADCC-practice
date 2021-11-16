// eslint-disable-next-line import/extensions
import Helpers from '../helpers.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = h.linspace(0, 10, 25e-2);
const BER_THEORETICAL = h.getTheoreticalBerBfsk(EB_N0_DB);
const BER = new Array(EB_N0_DB.length);

const BFSK = () => {
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
        BER[i] = 1 - (unchangedBits / NO_OF_BITS);
    }
};

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);

const simulationData = document.getElementById('simulation');
const theoreticalData = document.getElementById('theory');
const spinner = document.querySelector('span.spinner-border');

theoreticalData.addEventListener('click', () => h.saveData(EB_N0_DB, BER_THEORETICAL, 'theory'));
simulationData.addEventListener('click', () => h.saveData(EB_N0_DB, BER, 'simulation'));

document.getElementById('simulate').addEventListener('click', async () => {
    spinner.classList.remove('d-none');
    setTimeout(() => {
        BFSK();
        h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('index', 'helpers');
