const { Plotly, jStat } = window;

export default class Helpers {
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

        this.getTheoreticalSerQpsk = (EB_N0_DB) => EB_N0_DB
            .map((EB_N0) => 2 * this.qfunc(Math.sqrt(10 ** (EB_N0 / 10)))
                - this.qfunc(Math.sqrt(10 ** (EB_N0 / 10))) ** 2);

        this.getTheoreticalBerBfsk = (EB_N0_DB) => EB_N0_DB
            .map((EB_N0) => this.qfunc(Math.sqrt((10 ** (EB_N0 / 10)))));

        this.randi = ([min, max], count) => {
            const integers = [];
            // eslint-disable-next-line no-plusplus, no-param-reassign
            while (count--) {
                integers.push(Math.floor(min + ((max - min + 1) * Math.random())));
            }
            return integers;
        };

        this.randn = (count) => new Array(count).fill(0).map(() => jStat.normal.sample(0, 1));

        this.plot = (labels, ...data) => {
            const traces = [];
            data.forEach(([x, y], i) => {
                traces.push({
                    x,
                    y,
                    type: 'scatter',
                    line: { shape: 'spline' },
                    name: labels[i],
                });
            });
            const layout = {
                xaxis: {
                    autorange: true,
                    tickmode: 'linear',
                    title: {
                        text: 'Eb/N0(dB)',
                        font: {
                            size: 20,
                        },
                    },
                },
                yaxis: {
                    type: 'log',
                    autorange: true,
                    showexponent: 'all',
                    exponentformat: 'power',
                    tickmode: 'linear',
                    title: {
                        text: 'SER',
                        font: {
                            size: 20,
                        },
                    },
                },
            };
            Plotly.newPlot('plot', traces, layout);
        };

        this.getAWGN = (EB_N0_DB, [rows, cols]) => {
            const awgn = this.randn(rows * cols)
                .map((N) => N / Math.sqrt(2 * (10 ** (EB_N0_DB / 10))));
            if (cols === 1) return awgn;
            return awgn.reduce((acc, N, j) => {
                if (j % cols === 0) {
                    const diNoise = [N];
                    acc.push(diNoise);
                } else {
                    acc[acc.length - 1].push(N);
                }
                return acc;
            }, []);
        };

        this.indexOf = (arr1, arr2) => {
            for (let i = 0; i < arr1.length; i += 1) {
                if (arr1[i].toString() === arr2.toString()) return i;
            }
            return -1;
        };

        this.dec2bin = (number, length) => {
            let binaryString = '';
            for (let i = 0; i < length - 1; i += 1) binaryString += '0';
            binaryString += number.toString(2);
            return binaryString.slice(-length);
        };

        this.saveData = (EB_N0_DB, SER, fileName) => {
            const data = new Array(EB_N0_DB.length).fill(0)
                .map((_, i) => [EB_N0_DB[i], SER[i]])
                // eslint-disable-next-line no-return-assign, no-param-reassign
                .reduce((acc, entry) => acc += `${entry.join(' ')}\n`, '');
            const blob = new Blob([data], {
                type: 'text/plain',
            });
            const blobURL = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${fileName}.dat`;
            link.href = blobURL;
            link.click();
        };
    }
}
