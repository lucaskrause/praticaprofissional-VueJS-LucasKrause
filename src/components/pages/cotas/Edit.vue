<template>
    <div class="col-12">
        <h2>Cadastro de Cota</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-2">
                <label>Cota</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-1">
                <label>Código</label>
                <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="searchCliente"/>
            </div>

            <div class="col-4">
                <label>Cliente</label>
                <div class="input-group">
                    <input id="cliente" type="text" class="form-control" v-uppercase v-model.lazy="clienteSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-2 form-group">
                <label>Valor</label>
                <input id="valor" type="number" class="form-control" v-model.number="entity.valor"/>
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

        <b-modal id="modal-consult-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" :isCota="true" />
        </b-modal>
    </div>
</template>

<script>
import {ClientesService} from '@/services/clientes.service'
import {CotasService} from '@/services/cotas.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import Helper from '@/components/helper'
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
                codigoCliente: 0,
                valor: null,
                dtInicio: null,
                dtTermino: null,
                dtCadastro: null,
                dtAlteracao: null
            },
            clienteSelecionado: null,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;

            CotasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                var dateInicio = Helper.dateToDateString(vm.entity.dtInicio);
                var dateTermino = Helper.dateToDateString(vm.entity.dtTermino);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                vm.entity.dtInicio = dateInicio;
                vm.entity.dtTermino = dateTermino;
                vm.entity.dtCadastro = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.entity.dtAlteracao = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.clienteSelecionado = vm.entity.cliente.nome;
            });
        }
    },
    methods: {
        selectCliente(entity) {
            this.clienteSelecionado = entity.nome;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consult-cliente");
        },
        searchCliente() {
            var vm = this;
            if (vm.entity.codigoCliente > 0) {
                ClientesService.getById(vm.entity.codigoCliente).then(function (response) {
                    vm.clienteSelecionado = response.data.nome;
                }).catch(function() {
                    vm.entity.codigoCliente = 0;
                    vm.clienteSelecionado = null;
                    notyf.error("Cliente não encontrado");
                });
            } else {
                vm.clienteSelecionado = null;
            }
        },
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            CotasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Cota " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/cotas');
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>