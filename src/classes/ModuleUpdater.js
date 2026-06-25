class ModuleUpdater {

    constructor(module) {
        this.module = module;
        this.active = true;
        this.cache = {};
    }

    update() {
        if(this.active) this.onUpdate();
    }

    onUpdate() {}
}

export default ModuleUpdater;