import EnchanceTicket from "./modules/EnchanceTicket.js";
import BaseModule from "./modules/BaseModule.js";

export let modules = [
    BaseModule,
    EnchanceTicket,
];

export let configs = {
    debug: false,
    intervalFreq: 200,
    dbName: 'scw-tweaker',
    dbVersion: 4,
};

export default configs;