/**
 * @namespace solfege
 */

// Check the node version
let currentVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
if (currentVersion < 0.12) {
    console.error("SolfegeJS requires Node version 0.12+");
    process.exit(1);
}

// Check the Proxy feature
if (typeof Proxy === "undefined") {
    console.error("SolfegeJS requires ES6 Proxy");
    process.exit(1);
}

// Check the Generator feature
import generatorDetector from "node-generator-detector";
if (!generatorDetector()) {
    console.error("SolfegeJS requires ES6 Generator");
    process.exit(1);
}

// Create a package
import description from "../package.json";
import {createPackage} from "./util/ObjectProxy";
let getters = {
    /**
     * String representation of the package
     *
     * @return  {string}    The string representation
     */
    toString: function () {
        return 'SolfegeJS ' + description.version;
    },

    /**
     * The version
     *
     * @type {string}
     */
    version: description.version
};
export default createPackage(__dirname, getters);

