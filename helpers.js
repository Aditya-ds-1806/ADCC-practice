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

        this.getTheoreticalBER = (arr) => arr
            .map((entry) => 0.5 * jStat.erfc(Math.sqrt(2 * 10 ** (entry / 10)) / Math.SQRT2));

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
                        text: 'BER',
                        font: {
                            size: 20,
                        },
                    },
                },
            };
            Plotly.newPlot('plot', traces, layout);
        };

        this.saveData = (EB_N0_DB, BER, fileName) => {
            const data = new Array(EB_N0_DB.length).fill(0)
                .map((_, i) => [EB_N0_DB[i], BER[i]])
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
