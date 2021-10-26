<template>
    <div class="col-12">
        <h2>Conta à Pagar</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-2">
                <label>Modelo</label><span class="isRequired"> *</span>
                <input id="modelo" type="number" class="form-control" v-model="entity.modelo" readonly/>
            </div>

            <div class="col-2">
                <label>Série</label><span class="isRequired"> *</span>
                <input id="serie" type="number" class="form-control" v-model="entity.serie" readonly/>
            </div>

            <div class="col-2">
                <label>Nº Nota</label><span class="isRequired"> *</span>
                <input id="numeroNota" type="number" class="form-control" v-model="entity.numeroNF" readonly/>
            </div>

            <div class="col-4">
                <label>Fornecedor</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFornecedor" type="number" class="form-control" v-model.number="entity.codigoFornecedor" @input="onSearchFornecedor" readonly/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="fornecedorSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-fornecedor class="btn btn-info ml-1" disabled>Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Número Parcela</label><span class="isRequired"> *</span>
                <input id="numeroParcela" type="number" class="form-control" v-model="entity.numeroParcela" readonly/>
            </div>

            <div class="col-2">
                <label>Valor Parcela</label><span class="isRequired"> *</span>
                <input id="valorParcela" type="number" class="form-control" v-model="entity.valorParcela" readonly/>
            </div>

            <div class="col-4">
                <label>Forma de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFormaPagamento" type="number" class="form-control" v-model.number="entity.codigoFormaPagamento" @input="onSearchFormaPagamento" readonly/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="formaSelecionada" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-forma class="btn btn-info ml-1" disabled>Buscar</b-button>
                    </span>
                </div>
            </div>
            
            <div class="col-2">
                <label>Data de Vencimento</label>
                <input id="dtVencimento" type="date" class="form-control" v-model="entity.dtVencimento" readonly/>
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

            <div class="col-2">
                <label>Situação</label>
                <input id="status" class="form-control" v-model="entity.status" readonly/>
            </div>

            <div class="col-8">
                <div class="text-right">
                    <router-link :to="{name: 'ContasPagarList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Pagar" class="btn btn-success" @click.prevent="pagar()" :class="{'disabled': isSubmiting}" :disabled="entity.status == 'Pago'">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ContasPagarService} from '@/services/contasPagar.service'
import {FornecedoresService} from '@/services/fornecedores.service'
import {FormasPagamentoService} from '@/services/formasPagamento.service'
import Helper from '@/components/helper'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "ContasPagarView",
    props: {
        conta: {
            type: Object,
            default: null
        },    
    },
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
            isSubmiting: false
        }
    },
    created() {
        if (this.conta) {
            let vm = this;
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
                    vm.findCompra();
                }).catch(function() {
                    vm.entity.codigoFornecedor = 0;
                    vm.fornecedorSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Fornecedor não encontrada");
                    vm.findCompra();
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
            this.findCompra();
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
                    vm.findCompra();
                }).catch(function() {
                    vm.entity.codigoFormaPagamento = 0;
                    vm.formaSelecionada = null;
                    vm.isLoading = false;
                    notyf.error("Forma de Pagamento não encontrada");
                    vm.findCompra();
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
            this.findCompra();
        },
        pagar() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            ContasPagarService.pagar(this.entity).then(function () {
                notyf.success("Conta paga com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/contasPagar');

            }).catch((error) => Helper.saveErrorCallBack(error.response));
        }
    }
}
</script>