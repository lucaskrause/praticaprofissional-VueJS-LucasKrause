<template>
    <div class="col-12">
        <h2>Cadastro de Cota</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Cliente</label>
                <div class="input-group">
                    <input id="cliente" type="text" class="form-control" v-model="clienteSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-cliente class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-2 form-group">
                <label>Valor</label>
                <input id="valor" type="number" class="form-control" v-model="entity.valor"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-3">
                <label>Data de Início</label>
                <input id="dtInicio" type="date" class="form-control" v-model="entity.dtInicio"/>
            </div>

            <div class="col-3">
                <label>Data de Término</label>
                <input id="dtTermino" type="date" class="form-control" v-model="entity.dtTermino"/>
            </div>
        </div>

        <div class="row form-group align-items-end mt-5">
            <div class="col-2">
                <label>Data de Cadastro</label>
                <input id="dataCadastro" type="text" class="form-control" v-model="entity.dtCadastro" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Alteração</label>
                <input id="dataAlteracao" type="text" class="form-control" v-model="entity.dtAlteracao" readonly/>
            </div>

            <div class="col-8">
                <div class="text-right">
                    <router-link :to="{name: 'CotasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consulta-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" />
        </b-modal>
    </div>
</template>

<script>
import {CotasService} from '@/services/cotas.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "CotasEdit",
    components: { ConsultaCliente },
    data() {
        return {
            entity: {
                codigo: 0,
                codigoCliente: "",
                valor: "",
                dtInicio: "",
                dtTermino: "",
                dtCadastro: "",
                dtAlteracao: ""
            },
            clienteSelecionado: "",
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        this.entity.codigo = this.$route.params.codigo;
        if (this.entity.codigo) {
            CotasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
            });
        }
    },
    methods: {
        selectCliente(entity) {
            this.clienteSelecionado = entity.cliente;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consulta-cliente");
        },
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            CotasService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("País " + msg + " com sucesso");
                vm.isSubmiting = false;
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-pais', vm.entity);
                } else {
                    vm.$router.push('/cotas');
                }
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>