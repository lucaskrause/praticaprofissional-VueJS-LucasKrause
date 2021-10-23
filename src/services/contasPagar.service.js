import {Service} from "@/services/service";

const instance = new class ContasPagarService extends Service{
    getParcela(entity) {
        return this.api.post(this.endpoint + "/getParcela", entity);
    }

    cancel(entity) {
        return this.api.post(this.endpoint + "/pagar", entity);
    }
};

export {instance as ContasPagarService}