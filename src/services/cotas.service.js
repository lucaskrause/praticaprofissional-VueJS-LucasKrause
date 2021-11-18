import {Service} from "@/services/service";

const instance = new class CotasService extends Service{
    gerarParcelas(entity) {
        return this.api.post(this.endpoint + "/parcelas", entity);
    }
};

export {instance as CotasService}