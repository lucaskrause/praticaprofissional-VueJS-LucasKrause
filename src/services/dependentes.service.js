import {Service} from "@/services/service";

const instance = new class DependentesService extends Service{};

export {instance as DependentesService}