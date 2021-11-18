import Helpers from '../helpers.js';
import BFSK from './BFSK.js';

const h = new Helpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = h.linspace(0, 10, 25e-2);
const BER_THEORETICAL = h.getTheoreticalBerBfsk(EB_N0_DB);
const BER = new Array(EB_N0_DB.length);

h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);

const simulationData = document.getElementById('simulation');
const theoreticalData = document.getElementById('theory');
const spinner = document.querySelector('span.spinner-border');

theoreticalData.addEventListener('click', () => h.saveData(EB_N0_DB, BER_THEORETICAL, 'theory'));
simulationData.addEventListener('click', () => h.saveData(EB_N0_DB, BER, 'simulation'));

document.getElementById('simulate').addEventListener('click', async () => {
    spinner.classList.remove('d-none');
    setTimeout(() => {
        BFSK(EB_N0_DB, NO_OF_BITS, BER);
        h.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

h.fetchJS('./BFSK.js', '../helpers.js');
