const { Plotly, hljs } = window;

export default class DomHelpers {
    constructor() {
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
            const config = {
                responsive: true,
            };
            Plotly.newPlot('plot', traces, layout, config);
        };

        this.indexOf = (arr1, arr2) => {
            for (let i = 0; i < arr1.length; i += 1) {
                if (arr1[i].toString() === arr2.toString()) return i;
            }
            return -1;
        };

        this.clone = (node) => {
            const newNode = node.cloneNode(true);
            node.parentNode.replaceChild(newNode, node);
            return newNode;
        };

        this.saveData = (SB_N0_DB, SER, fileName) => {
            const data = new Array(SB_N0_DB.length).fill(0)
                .map((_, i) => [SB_N0_DB[i], SER[i]])
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

        this.fetchJS = (...urls) => {
            const codeElement = document.getElementById('code');
            urls.forEach(async (url) => {
                const h3 = document.createElement('h3');
                const code = document.createElement('code');
                const pre = document.createElement('pre');
                const js = await (await fetch(url)).text();
                h3.textContent = url.split('/').slice(-1);
                code.append(js);
                pre.append(code);
                codeElement.append(h3, pre);
                hljs.highlightAll();
            });
        };
    }
}
