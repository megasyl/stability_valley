const isotopes = [];
const fs = require('fs');
const toCamelCase = (str) => str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g,
        (m, chr) => chr.toUpperCase());

fs.readFileSync('nist_isotopes', 'utf-8').split(/\r?\n\n/).forEach(function(bloc){
    const isotope = bloc.split(/\r?\n/).reduce((isotope, line) => {
        const lineElements = line.split('=').map(lineElement => lineElement.trim());
        const key = lineElements[0];
        let value = lineElements[1];
        try {

            value = key === 'Notes' ? value.split(',') : JSON.parse(value);
        } catch (e) {
        }
        isotope[toCamelCase(key)] = value;
        return isotope;
    }, {});
    isotopes.push(isotope);
});

fs.writeFile('nist_isotopes.json', JSON.stringify(isotopes), 'utf8', () => {});
