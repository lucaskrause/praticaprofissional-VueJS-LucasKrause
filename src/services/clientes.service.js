import {Service} from "@/services/service";

const instance = new class ClientesService extends Service{
    getSocioById(codigo){
        return this.api.get(this.endpoint + "/socio/" + codigo);
    }
};

export {instance as ClientesService}