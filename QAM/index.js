// eslint-disable-next-line import/extensions
import Helpers from '../helpers.js';

const h = new Helpers();

const NO_OF_BITS = 3 * 10 ** 5;
const NO_OF_SYMBOLS = NO_OF_BITS / 3;
const SB_N0_DB = h.linspace(0, 10, 25e-2);
const SER = new Array(SB_N0_DB.length);
let SER_THEORETICAL = new Array(SB_N0_DB.length);
const M = 8;

const QAM = (D) => {
    const RIGHT = D / 2 + (M / 4 - 1) * D;
    const LEFT = -RIGHT;
    const Es = 1.5 * (D ** 2);
    const constellation = h
        .linspace(LEFT, RIGHT, D)
        .map((point) => [[point, D / 2], [point, -D / 2]])
        .flat();
    const Bk = h.randi([0, 1], NO_OF_BITS); // message
    const Sk = Bk.reduce((acc, bit, i) => { // modulation
        if (i % 3 === 0) {
            const tribit = [bit];
            acc.push(tribit);
        } else {
            acc[acc.length - 1].push(bit);
        }
        return acc;
    }, []).map((tribit) => constellation[parseInt(tribit.join(''), 2)]);
    SER_THEORETICAL = h.getTheoreticalSerQam8(SB_N0_DB, Es);
    for (let i = 0; i < SB_N0_DB.length; i += 1) {
        const Nk = h.getAWGN(SB_N0_DB[i], [NO_OF_SYMBOLS, 2]); // AWGN noise
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
            return h.dec2bin(h.indexOf(constellation, closestPoint), 3).split('').map((char) => Number(char));
        });
        const unchangedSymbols = sHat.reduce((acc, symbol, j) => {
            const s = Bk.slice(3 * j, 3 * j + 3);
            // eslint-disable-next-line no-param-reassign
            if (symbol.toString() === s.toString()) acc += 1;
            return acc;
        }, 0);
        SER[i] = 1 - (unchangedSymbols / NO_OF_SYMBOLS);
    }
    return SER;
};

h.plot(['Theoretical', 'Simulation'], [SB_N0_DB, SER_THEORETICAL], [SB_N0_DB, SER]);

const simulationData = document.getElementById('simulation');
const theoreticalData = document.getElementById('theory');
const spinner = document.querySelector('span.spinner-border');

theoreticalData.addEventListener('click', () => h.saveData(SB_N0_DB, SER_THEORETICAL, 'theory'));
simulationData.addEventListener('click', () => h.saveData(SB_N0_DB, SER, 'simulation'));

document.getElementById('simulate').addEventListener('click', async () => {
    const dInput = document.getElementById('D');
    const D = (Number(dInput.value) || 1);
    dInput.value = D;
    spinner.classList.remove('d-none');
    setTimeout(() => {
        QAM(D);
        h.plot(['Theoretical', 'Simulation'], [SB_N0_DB, SER_THEORETICAL], [SB_N0_DB, SER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('index', 'helpers');
