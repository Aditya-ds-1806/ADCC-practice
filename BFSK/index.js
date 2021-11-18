import BFSK from './BFSK.js';
import DomHelpers from '../helpers/DomHelpers.js';
import SimulationHelpers from '../helpers/SimulationHelpers.js';

const D = new DomHelpers();
const S = new SimulationHelpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = S.linspace(0, 10, 25e-2);

D.plot(['Theoretical', 'Simulation'], [EB_N0_DB, []], [EB_N0_DB, []]);

let simulationData = document.getElementById('simulation');
let theoreticalData = document.getElementById('theory');
const spinner = document.querySelector('span.spinner-border');

document.getElementById('simulate').addEventListener('click', async () => {
    spinner.classList.remove('d-none');
    setTimeout(() => {
        const [BER, BER_THEORETICAL] = BFSK(EB_N0_DB, NO_OF_BITS);
        simulationData = D.clone(simulationData);
        theoreticalData = D.clone(theoreticalData);
        simulationData.addEventListener('click', () => D.saveData(EB_N0_DB, BER, 'simulation'));
        theoreticalData.addEventListener('click', () => D.saveData(EB_N0_DB, BER_THEORETICAL, 'theory'));
        D.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

D.fetchJS('./BFSK.js', '../helpers/SimulationHelpers.js');
