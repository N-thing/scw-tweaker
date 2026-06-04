import './style/main.css';
import Core from './core.js';
import { log } from './utils.js';
import { modules } from './configs.js';
import Button from './classes/ui/Button.js';

console.log(`
============================================
            SCW Tweaker start
============================================
`);

let core = new Core();

for(const module of modules) {
    core.addModule(new module());
}

core.init();