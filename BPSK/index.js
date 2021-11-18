import BPSK from './BPSK.js';
import DomHelpers from '../helpers/DomHelpers.js';
import SimulationHelpers from '../helpers/SimulationHelpers.js';

const D = new DomHelpers();
const S = new SimulationHelpers();

const NO_OF_BITS = 10 ** 6;
const EB_N0_DB = S.linspace(0, 10, 25e-2);

D.plot(['Theoretical', 'Simulation'], [EB_N0_DB, []], [EB_N0_DB, []]);

document.getElementById('simulate').addEventListener('click', async () => {
    const spinner = document.querySelector('span.spinner-border');
    let simulationData = document.getElementById('simulation');
    let theoreticalData = document.getElementById('theory');
    spinner.classList.remove('d-none');
    setTimeout(() => {
        const [BER, BER_THEORETICAL] = BPSK(EB_N0_DB, NO_OF_BITS);
        theoreticalData = D.clone(theoreticalData);
        simulationData = D.clone(simulationData);
        D.plot(['Theoretical', 'Simulation'], [EB_N0_DB, BER_THEORETICAL], [EB_N0_DB, BER]);
        theoreticalData.addEventListener('click', () => D.saveData(EB_N0_DB, BER_THEORETICAL, 'theory'));
        simulationData.addEventListener('click', () => D.saveData(EB_N0_DB, BER, 'simulation'));
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

D.fetchJS('./BPSK.js', '../helpers/SimulationHelpers.js');
