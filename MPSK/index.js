// eslint-disable-next-line import/extensions
import Helpers from '../helpers.js';

const h = new Helpers();

const M = 8;
const L = Math.log2(M);
const NO_OF_BITS = L * (10 ** 5);
const NO_OF_SYMBOLS = NO_OF_BITS / L;
const EB_N0_DB = h.linspace(0, 10, 25e-2);
const SER_THEORETICAL = h.getTheoreticalSerQpsk(EB_N0_DB);
const SER = new Array(EB_N0_DB.length);

const mpsk = () => {
    const phases = new Array(M).fill(0).map((_, i) => (2 * i * Math.PI) / M);
    const constellation = phases.map((phase) => [Math.cos(phase), Math.sin(phase)]);
    const Bk = h.randi([0, 1], NO_OF_BITS); // message
    const Sk = Bk.reduce((acc, bit, i) => { // modulation
        if (i % L === 0) {
            const lbit = [bit];
            acc.push(lbit);
        } else {
            acc[acc.length - 1].push(bit);
        }
        return acc;
    }, []).map((s) => constellation[parseInt(s.join(''), 2)]);
    for (let i = 0; i < EB_N0_DB.length; i += 1) {
        const Nk = h.getAWGN(EB_N0_DB[i], [NO_OF_SYMBOLS, 2]); // AWGN noise
        const Yk = new Array(NO_OF_SYMBOLS).fill(0).map((_, j) => h.sum(Sk[j], Nk[j]));
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
            return h.dec2bin(h.indexOf(constellation, closestPoint), L).split('').map((char) => Number(char));
        }); // ML decision rule
        const unchangedSymbols = sHat.reduce((acc, symbol, j) => {
            const s = Bk.slice(L * j, L * j + L);
            // eslint-disable-next-line no-param-reassign
            if (symbol.toString() === s.toString()) acc += 1;
            return acc;
        }, 0);
        SER[i] = 1 - (unchangedSymbols / NO_OF_SYMBOLS);
    }
};

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, SER_THEORETICAL], [EB_N0_DB, SER]);

const simulationData = document.getElementById('simulation');
const theoreticalData = document.getElementById('theory');
const spinner = document.querySelector('span.spinner-border');

theoreticalData.addEventListener('click', () => h.saveData(EB_N0_DB, SER_THEORETICAL, 'theory'));
simulationData.addEventListener('click', () => h.saveData(EB_N0_DB, SER, 'simulation'));

document.getElementById('simulate').addEventListener('click', async () => {
    spinner.classList.remove('d-none');
    setTimeout(() => {
        mpsk();
        h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, SER_THEORETICAL], [EB_N0_DB, SER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('index', 'helpers');
