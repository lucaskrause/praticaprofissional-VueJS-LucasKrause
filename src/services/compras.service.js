import {Service} from "@/services/service";

const instance = new class ComprasService extends Service{
    find(entity) {
        return this.api.post(this.endpoint + "/find", entity);
    }

    getCompra(entity) {
        return this.api.post(this.endpoint + "/getCompra", entity);
    }

    cancel(entity) {
        return this.api.post(this.endpoint + "/cancel", entity);
    }
};

export {instance as ComprasService}