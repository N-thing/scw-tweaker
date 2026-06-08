import { log } from "../utils";
import configs from '../configs';

class Module {
    constructor(core, id, name) {
        this.core = core;
        this.id = id;
        this.name = name;
        this.configs = new ModuleConfigs(id);
        this.configs.addConfig('enabled', "Boolean", true);

        this.cache = {};
        this.updaters = [];

        log(`Загружен модуль: ${name}`);
    }

    async init() {
        await this.configs.load();
    }

    addUpdater(upd) {
        this.updaters.push(upd);
    }

    removeUpdater(upd) {
        this.updaters.splice(this.updatees.indexOf(upd), 1)
    }

    applyPage(page) {
        this.page = page;
    }
    interval() {}
    onUpdate() {}
}

export class ModuleConfigs {
    constructor(moduleId) {
        this.moduleId = moduleId;
        this.list = {};
    }
    addConfig(name, type, value) {
        this.list[name] = new ModuleConfig(this.moduleId, name, type, value)
    }
    async setValue(name, value) {
        return await this.list[name].setValue(value);
    }
    getValue(name) {
        return this.list[name].value;
    }
    getConfig(name) {
        return this.list[name];
    }
    async clear() {
        await chrome.storage.local.clear();
    }
    async load() {
        for(const config in this.list) {
            await this.list[config].load();
        }
        log(this.list, 'configs loaded');
    }
}

class ModuleConfig {

    _value;
    get value() { return this._value; }

    constructor(moduleId, name, type, value) {
        this.moduleId = moduleId;
        this.name = name;
        this.id = `${this.moduleId}_${this.name}`;
        this.type = type;
        this._value = value;
    }

    addValue(value) {
        if(this.type == "Array") {

            this._value.push(value);
            this.save();
            return true;

        } else if(this.type == "Object" && typeof value == 'Object') {

            this._value = Object.assign(this._value, value)
            this.save();
            return true;

        }
        return false;
    }

    async setValue(value) {
        let result = await this.save(value);
        if(result) {
            this._value = value;
            return true;
        } else {
            return false;
        }
    }

    async save(value) {
        value = value ?? this.value;
        try {
            log(this.id)
            log(value)
            await chrome.storage.local.set({ [this.id]: value });
            return true;
        } catch(e) {
            log(`save config failed: ${e}`, 'error');
            return false;
        }
    }

    async load() {
        let result = await chrome.storage.local.get(this.id);
        this._value = result[this.id] ?? this._value;
    }
}

export default Module;