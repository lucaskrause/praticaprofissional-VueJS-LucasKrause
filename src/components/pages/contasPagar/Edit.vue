<template>
    <div class="col-12">
        <h2>Conta à Pagar</h2>
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
                <label>Fornecedor</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFornecedor" type="number" class="form-control" v-model.number="entity.codigoFornecedor" @input="onSearchFornecedor" :disabled="isEdit"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="fornecedorSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-fornecedor class="btn btn-info ml-1" :disabled="isEdit">Buscar</b-button>
                    </span>
                </div>
            </div>
            
            <div class="col-1">
                <label>Nº Parcela</label><span class="isRequired"> *</span>
                <input id="numeroParcela" type="number" class="form-control" v-model.number="entity.numeroParcela" :disabled="isEdit"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Valor Parcela</label><span class="isRequired"> *</span>
                <money id="valorParcela" class="form-control text-right" v-bind="money" v-model.number="entity.valorParcela" :disabled="isEdit"></money>
            </div>

            <div class="col-4">
                <label>Forma de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFormaPagamento" type="number" class="form-control" v-model.number="entity.codigoFormaPagamento" @input="onSearchFormaPagamento" :disabled="entity.status != 'Pendente'"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="formaSelecionada" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-forma class="btn btn-info ml-1" :disabled="entity.status != 'Pendente'">Buscar</b-button>
                    </span>
                </div>
            </div>
            
            <div class="col-2">
                <label>Data de Vencimento</label>
                <input id="dtVencimento" type="date" class="form-control" v-model="entity.dtVencimento" :disabled="entity.status != 'Pendente'"/>
            </div>
        </div>

        <div class="row form-group align-items-end mt-5">
            <div class="col-2">
                <label>Data de Emissão</label>
                <input id="dataEmissao" type="date" class="form-control" v-model="entity.dtEmissao" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Pagamento</label>
                <input id="dtPagamento" type="date" class="form-control" v-model="entity.dtPagamento" readonly/>
            </div>
            
            <div class="col-2">
                <label>Situação</label>
                <input id="status" class="form-control" v-model="entity.status" readonly/>
            </div>

            <div class="col-6">
                <div class="text-right">
                    <router-link :to="{name: 'ContasPagarList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}" :disabled="entity.status != 'Pendente'">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-fornecedor" size="xl" title="Consultar Fornecedor" hide-footer>
            <ConsultaFornecedor @emit-fornecedor="selectFornecedor" :isModal="true"/>
        </b-modal>

        <b-modal id="modal-consult-forma" size="xl" title="Consultar Condição de Pagamento" hide-footer>
            <ConsultaFormaPagamento @emit-forma="selectFormaPagamento" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {ContasPagarService} from '@/services/contasPagar.service'
import {FornecedoresService} from '@/services/fornecedores.service'
import {FormasPagamentoService} from '@/services/formasPagamento.service'
import ConsultaFornecedor from '@/components/pages/fornecedores/Consult.vue'
import ConsultaFormaPagamento from '@/components/pages/formasPagamento/Consult.vue'
import {Money} from 'v-money'
import Helper from '@/components/helper'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "ContasPagarEdit",
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
    components: { ConsultaFornecedor, ConsultaFormaPagamento, Money },
    data() {
        return {
            entity: {
                modelo: null,
                serie: null,
                numeroNF: null,
                codigoFornecedor: 0,
                numeroParcela: 0,
                valorParcela: 0,
                codigoFormaPagamento: 0,
                dtVencimento: null,
                dtPagamento: null,
            },
            dtCad: null,
            dtAlt: null,
            fornecedorSelecionado: null,
            formaSelecionada: null,
            isLoading: false,
            isSubmiting: false,
            money: {
                decimal: ',',
                thousands: '.',
                prefix: 'R$ ',
                suffix: '',
                precision: 2,
                masked: false
            },
        }
    },
    created() {
        if (this.$route.name != "ContasPagarCad") {
            if (this.conta) {
                this.isEdit = true;
                const vm = this;
                ContasPagarService.getParcela(this.conta).then(function (response) {
                    vm.entity = response.data;

                    var dateEmissao = Helper.dateToDateString(vm.entity.dtEmissao);
                    var dateVencimento = Helper.dateToDateString(vm.entity.dtVencimento);
                    var datePagamento = Helper.dateToDateString(vm.entity.dtPagamento);

                    vm.entity.dtEmissao = dateEmissao;
                    vm.entity.dtVencimento = dateVencimento;
                    vm.entity.dtPagamento = datePagamento;
                    vm.fornecedorSelecionado = vm.entity.fornecedor.nome;
                    vm.formaSelecionada = vm.entity.formaPagamento.descricao;
                });
            } else {
                this.$router.push('/app/contasPagar');
            }
        }
    },
    methods: {
        onSearchFornecedor() {
            this.searchFornecedor(this);
        },
        searchFornecedor: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoFornecedor > 0) {
                FornecedoresService.getById(vm.entity.codigoFornecedor).then(function (response) {
                    vm.fornecedorSelecionado = response.data.nome;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoFornecedor = 0;
                    vm.fornecedorSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Fornecedor não encontrada");
                });
            } else {
                vm.fornecedorSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        selectFornecedor(entity) {
            this.entity.codigoFornecedor = entity.codigo;
            this.fornecedorSelecionado = entity.nome;
            this.$bvModal.hide("modal-new-fornecedor");
            this.$bvModal.hide("modal-consult-fornecedor");
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
                ContasPagarService.edit(this.entity).then(function () {
                    notyf.success("Conta registrada com sucesso");
                    vm.isSubmiting = false;
                    vm.$router.push('/app/contasPagar');
                }).catch(function (errors){
                    notyf.error(errors.response.data.message);
                    vm.isSubmiting = false;
                });
            } else {
                this.entity.dtEmissao = new Date();

                ContasPagarService.save(this.entity).then(function () {
                    notyf.success("Conta registrada com sucesso");
                    vm.isSubmiting = false;
                    vm.$router.push('/app/contasPagar');
                }).catch(function (errors){
                    notyf.error(errors.response.data.message);
                    vm.isSubmiting = false;
                });
            }
        }
    }
}
</script>