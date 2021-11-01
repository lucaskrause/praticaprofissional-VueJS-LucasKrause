<template>
    <div class="col-12">
        <h2>Conta à Receber</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-2">
                <label>Modelo</label><span class="isRequired"> *</span>
                <input id="modelo" type="number" class="form-control" v-model="entity.modelo" :disabled="isEdit"/>
            </div>

            <div class="col-2">
                <label>Série</label><span class="isRequired"> *</span>
                <input id="serie" type="number" class="form-control" v-model="entity.serie" :disabled="isEdit"/>
            </div>

            <div class="col-2">
                <label>Nº Nota</label><span class="isRequired"> *</span>
                <input id="numeroNota" type="number" class="form-control" v-model="entity.numeroNF" :disabled="isEdit"/>
            </div>

            <div class="col-4">
                <label>Cliente</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="onSearchCliente" :disabled="isEdit"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="clienteSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1" :disabled="isEdit">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Número Parcela</label><span class="isRequired"> *</span>
                <input id="numeroParcela" type="number" class="form-control" v-model.number="entity.numeroParcela" :disabled="isEdit"/>
            </div>

            <div class="col-2">
                <label>Valor Parcela</label><span class="isRequired"> *</span>
                <input id="valorParcela" type="number" class="form-control" v-model.number="entity.valorParcela" :disabled="isEdit"/>
            </div>

            <div class="col-4">
                <label>Forma de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFormaPagamento" type="number" class="form-control" v-model.number="entity.codigoFormaPagamento" @input="onSearchFormaPagamento"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="formaSelecionada" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-forma class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
            
            <div class="col-2">
                <label>Data de Vencimento</label>
                <input id="dtVencimento" type="date" class="form-control" v-model="entity.dtVencimento"/>
            </div>
            
            <div class="col-2">
                <label>Data de Pagamento</label>
                <input id="dtPagamento" type="date" class="form-control" v-model="entity.dtPagamento" readonly/>
            </div>
        </div>

        <div class="row form-group align-items-end mt-5">
            <div class="col-2">
                <label>Data de Emissão</label>
                <input id="dataEmissao" type="date" class="form-control" v-model="entity.dtEmissao" readonly/>
            </div>
            
            <div class="col-10">
                <div class="text-right">
                    <router-link :to="{name: 'ContasReceberList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" :isModal="true"/>
        </b-modal>

        <b-modal id="modal-consult-forma" size="xl" title="Consultar Condição de Pagamento" hide-footer>
            <ConsultaFormaPagamento @emit-forma="selectFormaPagamento" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {ContasReceberService} from '@/services/contasReceber.service'
import {ClientesService} from '@/services/clientes.service'
import {FormasPagamentoService} from '@/services/formasPagamento.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import ConsultaFormaPagamento from '@/components/pages/formasPagamento/Consult.vue'
import Helper from '@/components/helper'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "ContasReceberEdit",
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        conta: {
            type: Object,
            default: null
        },    
    },
    components: { ConsultaCliente, ConsultaFormaPagamento },
    data() {
        return {
            entity: {
                modelo: null,
                serie: null,
                numeroNF: null,
                codigoCliente: 0,
                numeroParcela: 0,
                valorParcela: 0,
                codigoFormaPagamento: 0,
                dtVencimento: null,
                dtPagamento: null,
            },
            dtCad: null,
            dtAlt: null,
            clienteSelecionado: null,
            formaSelecionada: null,
            isLoading: false,
            isSubmiting: false
        }
    },
    created() {
        if (this.$route.name != "ContasReceberCad") {
            if (this.conta) {
                this.isEdit = true;
                const vm = this;
                ContasReceberService.getParcela(this.conta).then(function (response) {
                    vm.entity = response.data;

                    var dateEmissao = Helper.dateToDateString(vm.entity.dtEmissao);
                    var dateVencimento = Helper.dateToDateString(vm.entity.dtVencimento);
                    var datePagamento = Helper.dateToDateString(vm.entity.dtPagamento);

                    vm.entity.dtEmissao = dateEmissao;
                    vm.entity.dtVencimento = dateVencimento;
                    vm.entity.dtPagamento = datePagamento;
                    vm.clienteSelecionado = vm.entity.cliente.nome;
                    vm.formaSelecionada = vm.entity.formaPagamento.descricao;
                });
            } else {
                this.$router.push('/app/contasReceber');
            }
        }
    },
    methods: {
        onSearchCliente() {
            this.searchCliente(this);
        },
        searchCliente: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoCliente > 0) {
                ClientesService.getById(vm.entity.codigoCliente).then(function (response) {
                    vm.clienteSelecionado = response.data.nome;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCliente = 0;
                    vm.clienteSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Cliente não encontrada");
                });
            } else {
                vm.clienteSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        selectCliente(entity) {
            this.entity.codigoCliente = entity.codigo;
            this.clienteSelecionado = entity.nome;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consult-cliente");
        },
        onSearchFormaPagamento() {
            this.searchFormaPagamento(this);
        },
        searchFormaPagamento: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoFormaPagamento > 0) {
                FormasPagamentoService.getById(vm.entity.codigoFormaPagamento).then(function (response) {
                    vm.formaSelecionada = response.data.descricao;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoFormaPagamento = 0;
                    vm.formaSelecionada = null;
                    vm.isLoading = false;
                    notyf.error("Forma de Pagamento não encontrada");
                });
            } else {
                vm.formaSelecionada = null;
                vm.isLoading = false;
            }
        }, 350),
        selectFormaPagamento(entity) {
            this.entity.codigoFormaPagamento = entity.codigo;
            this.formaSelecionada = entity.descricao;
            this.$bvModal.hide("modal-new-forma");
            this.$bvModal.hide("modal-consult-forma");
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            const vm = this;
            
            if (this.isEdit) {
                ContasReceberService.edit(this.entity).then(function () {
                    notyf.success("Conta registrada com sucesso");
                    vm.isSubmiting = false;
                    vm.$router.push('/app/contasReceber');
                }).catch(function (errors){
                    notyf.error(errors.response.data.message);
                    vm.isSubmiting = false;
                });
            } else {
                this.entity.dtEmissao = new Date();

                ContasReceberService.save(this.entity).then(function () {
                    notyf.success("Conta registrada com sucesso");
                    vm.isSubmiting = false;
                    vm.$router.push('/app/contasReceber');
                }).catch(function (errors){
                    notyf.error(errors.response.data.message);
                    vm.isSubmiting = false;
                });
            }
        }
    }
}
</script>