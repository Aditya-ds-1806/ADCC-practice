import Helpers from '../helpers.js';
import MPSK from './MPSK.js';

const h = new Helpers();

const NO_OF_SYMBOLS = 10 ** 5;
const SB_N0_DB = h.linspace(0, 10, 25e-2);

h.plot(['Theoretical', 'Simulation'], [SB_N0_DB, []], [SB_N0_DB, []]);

document.getElementById('simulate').addEventListener('click', async () => {
    const spinner = document.querySelector('span.spinner-border');
    const mInput = document.getElementById('M');
    const M = 2 ** Math.floor(Math.log2(Number(mInput.value || 8)));
    let simData = document.getElementById('simulation');
    let theoData = document.getElementById('theory');

    mInput.value = M;
    spinner.classList.remove('d-none');

    setTimeout(() => {
        const [SER, SER_THEORETICAL] = MPSK(M, SB_N0_DB, NO_OF_SYMBOLS);
        theoData = h.clone(theoData);
        simData = h.clone(simData);
        theoData.addEventListener('click', () => h.saveData(SB_N0_DB, SER_THEORETICAL, 'theory'));
        simData.addEventListener('click', () => h.saveData(SB_N0_DB, SER, 'simulation'));
        h.plot(['Theoretical', 'Simulation'], [SB_N0_DB, SER_THEORETICAL], [SB_N0_DB, SER]);
        simData.disabled = false;
        theoData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('./MPSK.js', '../helpers.js');
