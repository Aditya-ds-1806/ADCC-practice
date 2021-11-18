import Helpers from '../helpers.js';
import BFSK from './BFSK.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = h.linspace(0, 10, 25e-2);

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, []], [EB_N0_DB, []]);

let simulationData = document.getElementById('simulation');
let theoreticalData = document.getElementById('theory');
const spinner = document.querySelector('span.spinner-border');

document.getElementById('simulate').addEventListener('click', async () => {
    spinner.classList.remove('d-none');
    setTimeout(() => {
        const [BER, BER_THEORETICAL] = BFSK(EB_N0_DB, NO_OF_BITS);
        simulationData = h.clone(simulationData);
        theoreticalData = h.clone(theoreticalData);
        simulationData.addEventListener('click', () => h.saveData(EB_N0_DB, BER, 'simulation'));
        theoreticalData.addEventListener('click', () => h.saveData(EB_N0_DB, BER_THEORETICAL, 'theory'));
        h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('./BFSK.js', '../helpers.js');
