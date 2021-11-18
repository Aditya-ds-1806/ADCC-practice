import Helpers from '../helpers.js';
import QPSK from './QPSK.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const SB_N0_DB = h.linspace(0, 10, 25e-2);

h.plot(['Theoretical', 'Simulation'], [SB_N0_DB, []], [SB_N0_DB, []]);

document.getElementById('simulate').addEventListener('click', async () => {
    const spinner = document.querySelector('span.spinner-border');
    let simulationData = document.getElementById('simulation');
    let theoreticalData = document.getElementById('theory');
    spinner.classList.remove('d-none');
    setTimeout(() => {
        const [SER, SER_THEORETICAL] = QPSK(SB_N0_DB, NO_OF_BITS);
        theoreticalData = h.clone(theoreticalData);
        simulationData = h.clone(simulationData);
        theoreticalData.addEventListener('click', () => h.saveData(SB_N0_DB, SER_THEORETICAL, 'theory'));
        simulationData.addEventListener('click', () => h.saveData(SB_N0_DB, SER, 'simulation'));
        h.plot(['Theoretical', 'Simulation'], [SB_N0_DB, SER_THEORETICAL], [SB_N0_DB, SER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('./QPSK.js', '../helpers.js');
