import ApiService from './api.service'

export class Service {
    endpoint = '';
    api = null;
    constructor(modulo = false) {
        if(!modulo) modulo = this.constructor.name.replace("Service", "");
        this.endpoint = module;
        this.api = ApiService;
    }

    getAll() {
        return this.api.post(this.endpoint);
    }

    getById(id) {
        return this.api.get(this.endpoint + "/" + id);
    }

    save(entity) {
        if(entity.id) {
            return this.api.put(this.endpoint, entity);
        } else {
            return this.api.post(this.endpoint, entity);
        }
    }

    delete(id) {
        return this.api.delete(this.endpoint + "/" + id);
    }
}