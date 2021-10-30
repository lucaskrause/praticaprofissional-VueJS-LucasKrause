import {Service} from "@/services/service";

const instance = new class LocacoesService extends Service{
    verificaDisponibilidade(data) {
        return this.api.post(this.endpoint + "/verificaArea", data);
    }
};

export {instance as LocacoesService}