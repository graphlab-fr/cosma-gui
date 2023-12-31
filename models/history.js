/**
 * @file Manage the history of cosmocopes generations
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path');

const Record = require('../core/models/record');

module.exports = class History {
    /** @type {fs.PathLike} */

    static dirPath = path.join(app.getPath('temp'), 'cosma-history');

    /**
     * Get a number (14 caracters) from the time stats :
     * year + month + day + hour + minute + second
     * @return {number} - unique 14 caracters number from the second
     */

    static generateId() {
        return Record.generateId();
    }

    /**
     * @param {fs.PathLike} path 
     * @param {string} description 
     * @param {boolean} isTemp
     * @param {string} date
     */

    constructor(path, description = '', isTemp = false, date) {
        this.path = path;
        this.pathReport;
        this.description = description;
        this.isTemp = isTemp;
        this.date = new Date();

        if (date) {
            this.date = new Date(date);
        }
    }
}