import QPSK from './QPSK.js';
import DomHelpers from '../helpers/DomHelpers.js';
import SimulationHelpers from '../helpers/SimulationHelpers.js';

const D = new DomHelpers();
const S = new SimulationHelpers();

const NO_OF_BITS = 10 ** 6;
const SB_N0_DB = S.linspace(0, 10, 25e-2);

D.plot(['Theoretical', 'Simulation'], [SB_N0_DB, []], [SB_N0_DB, []]);

document.getElementById('simulate').addEventListener('click', async () => {
    const spinner = document.querySelector('span.spinner-border');
    let simulationData = document.getElementById('simulation');
    let theoreticalData = document.getElementById('theory');
    spinner.classList.remove('d-none');
    setTimeout(() => {
        const [SER, SER_THEORETICAL] = QPSK(SB_N0_DB, NO_OF_BITS);
        theoreticalData = D.clone(theoreticalData);
        simulationData = D.clone(simulationData);
        theoreticalData.addEventListener('click', () => D.saveData(SB_N0_DB, SER_THEORETICAL, 'theory'));
        simulationData.addEventListener('click', () => D.saveData(SB_N0_DB, SER, 'simulation'));
        D.plot(['Theoretical', 'Simulation'], [SB_N0_DB, SER_THEORETICAL], [SB_N0_DB, SER]);
        simulationData.disabled = false;
        theoreticalData.disabled = false;
        spinner.classList.add('d-none');
    }, 500);
});

D.fetchJS('./QPSK.js', '../helpers/SimulationHelpers.js');
