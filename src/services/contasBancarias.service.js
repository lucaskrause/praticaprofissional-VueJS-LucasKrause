import {Service} from "@/services/service";

const instance = new class ContasBancariasService extends Service{
    getByEmpresa(codigo) {
        return this.api.get(this.endpoint + "/empresa/" + codigo);
    }
};

export {instance as ContasBancariasService}