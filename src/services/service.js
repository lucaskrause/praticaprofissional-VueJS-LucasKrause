import ApiService from './api.service'

export class Service {
    endpoint = '';
    api = null;
    modulo = '';
    constructor() {
        this.modulo = this.constructor.name.replace("Service", "");
        this.endpoint = this.modulo;
        this.api = ApiService;
    }

    getAll() {
        return this.api.get(this.endpoint);
    }

    getById(codigo) {
        return this.api.get(this.endpoint + "/" + codigo);
    }

    save(entity) {
        if(entity.codigo) {
            return this.api.put(this.endpoint + "/editar", entity);
        } else {
            return this.api.post(this.endpoint + "/inserir", entity);
        }
    }

    delete(codigo) {
        return this.api.delete(this.endpoint + "/excluir/" + codigo);
    }
}