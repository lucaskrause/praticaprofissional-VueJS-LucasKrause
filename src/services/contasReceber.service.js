import {Service} from "@/services/service";

const instance = new class ContasReceberService extends Service{
    edit(entity) {
        return this.api.put(this.endpoint + "/editar", entity);
    }
    
    getParcela(entity) {
        return this.api.post(this.endpoint + "/getParcela", entity);
    }

    pagar(entity) {
        return this.api.post(this.endpoint + "/pagar", entity);
    }
};

export {instance as ContasReceberService}