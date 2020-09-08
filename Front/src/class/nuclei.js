import constants from '../constants.js';
export default class Nuclei {
    constructor(data) {
        this.massNumber = data.massNumber;
        this.protons = data.atomicNumber;
        this.neutrons = this.massNumber - this.protons;
        this.relativeAtomicMass = parseFloat(data.relativeAtomicMass.split('(').shift());
        this.mass = constants.ATOMIC_MASS * this.relativeAtomicMass;
        this.symbol = data.atomicSymbol;

        // Mc²/ A - http://www.laradioactivite.com/site/pages/lavalleedestabilite.htm
        //this.stability = (this.mass * Math.pow(constants.CELERITY, 2)) / this.massNumber;

        this.stability = this.relativeAtomicMass / this.massNumber;

    }
}
