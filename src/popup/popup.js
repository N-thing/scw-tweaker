import './style.css';
import { createElement, log } from '../utils.js';
import { modules } from '../configs.js';

window.addEventListener('DOMContentLoaded', () => {

    let content = document.getElementById('content');

    for(const moduleClass of modules) {

        let module = new moduleClass();

        let switcher = createElement('div', 'module-switcher', content);
        switcher.setAttribute('--data-module', module.id);

        let label = createElement('label', 'module-switcher-label', switcher, module.name);
        label.setAttribute('for', `${module.id}-switch-button`);
        
        let button = createElement('input', 'module-switcher-button', switcher);
        button.id = `${module.id}-switch-button`;
        button.type = "checkbox";
        
        module.configs.load().then(() => {
            button.checked = module.configs.get('enabled');
        });

        button.addEventListener('click', () => {
            module.configs.set('enabled', button.checked);
            module.configs.save();
        });
        
    }
    
});
