const { jStat } = window;

export default class SimulationHelpers {
    constructor() {
        this.sum = (arr1, arr2) => arr1.map((num, i) => num + arr2[i]);

        this.linspace = (start, stop, diff) => {
            const entries = [];
            let entry = start;
            while (entry <= stop) {
                entries.push(entry);
                entry += diff;
            }
            return entries;
        };

        this.qfunc = (arg) => 0.5 * jStat.erfc(arg / Math.SQRT2);

        this.getTheoreticalBerBpsk = (EB_N0_DB) => EB_N0_DB
            .map((EB_N0) => this.qfunc(Math.sqrt(2 * (10 ** (EB_N0 / 10)))));

        this.getTheoreticalSerQpsk = (SB_N0_DB) => SB_N0_DB
            .map((SB_N0) => 2 * this.qfunc(Math.sqrt(10 ** (SB_N0 / 10)))
                - this.qfunc(Math.sqrt(10 ** (SB_N0 / 10))) ** 2);

        this.getTheoreticalBerBfsk = (EB_N0_DB) => EB_N0_DB
            .map((EB_N0) => this.qfunc(Math.sqrt(10 ** (EB_N0 / 10))));

        this.getTheoreticalSerQam8 = (SB_N0_DB, Es) => SB_N0_DB
            .map((SB_N0) => 2.5 * this.qfunc(Math.sqrt(((10 ** (SB_N0 / 10)) * Es) / 3))
                - 1.5 * (this.qfunc(Math.sqrt(((10 ** (SB_N0 / 10)) * Es) / 3))) ** 2);

        this.getTheoreticalSerMpsk = (SB_N0_DB, M) => SB_N0_DB
            .map((SB_N0) => 2 * this
                .qfunc(Math.sqrt(2 * 10 ** (SB_N0 / 10)) * Math.sin(Math.PI / M)));

        this.randi = ([min, max], count) => {
            const integers = [];
            // eslint-disable-next-line no-plusplus, no-param-reassign
            while (count--) {
                integers.push(Math.floor(min + ((max - min + 1) * Math.random())));
            }
            return integers;
        };

        this.randn = (count) => new Array(count).fill(0).map(() => jStat.normal.sample(0, 1));

        this.getAWGN = (SB_N0_DB, [rows, cols]) => {
            const awgn = this.randn(rows * cols)
                .map((N) => N / Math.sqrt(2 * (10 ** (SB_N0_DB / 10))));
            if (cols === 1) return awgn;
            return awgn.reduce((acc, N, j) => {
                if (j % cols === 0) {
                    const noise = [N];
                    acc.push(noise);
                } else {
                    acc[acc.length - 1].push(N);
                }
                return acc;
            }, []);
        };

        this.dec2bin = (number, length) => {
            let binaryString = '';
            for (let i = 0; i < length - 1; i += 1) binaryString += '0';
            binaryString += number.toString(2);
            return binaryString.slice(-length);
        };
    }
}
