import EnchanceTicket from "./modules/EnchanceTicket.js";
import BaseModule from "./modules/BaseModule.js";

export let modules = [
    BaseModule,
    EnchanceTicket,
];

export let configs = {
    intervalFreq: 200
};

export default configs;