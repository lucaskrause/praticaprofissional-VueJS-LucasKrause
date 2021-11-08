import {Service} from "@/services/service";

const instance = new class LocacoesService extends Service{
    verificaDisponibilidade(data) {
        return this.api.post(this.endpoint + "/verificaArea", data);
    }    

    gerarParcelas(entity) {
        return this.api.post(this.endpoint + "/parcelas", entity);
    }
};

export {instance as LocacoesService}