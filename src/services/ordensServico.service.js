import {Service} from "@/services/service";

const instance = new class OrdensServicoService extends Service{
    gerarParcelas(entity) {
        return this.api.post(this.endpoint + "/parcelas", entity);
    }

    cancel(entity) {
        return this.api.post(this.endpoint + "/cancelar", entity);
    }
};

export {instance as OrdensServicoService}