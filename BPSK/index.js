import Helpers from '../helpers.js';
import BPSK from './BPSK.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = h.linspace(0, 10, 25e-2);

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, []], [EB_N0_DB, []]);

document.getElementById('simulate').addEventListener('click', async () => {
    const spinner = document.querySelector('span.spinner-border');
    let simulationData = document.getElementById('simulation');
    let theoreticalData = document.getElementById('theory');
    spinner.classList.remove('d-none');
    setTimeout(() => {
        const [BER, BER_THEORETICAL] = BPSK(EB_N0_DB, NO_OF_BITS);
        theoreticalData = h.clone(theoreticalData);
        simulationData = h.clone(simulationData);
        h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);
        theoreticalData.addEventListener('click', () => h.saveData(EB_N0_DB, BER_THEORETICAL, 'theory'));
        simulationData.addEventListener('click', () => h.saveData(EB_N0_DB, BER, 'simulation'));
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('./BPSK.js', '../helpers.js');
