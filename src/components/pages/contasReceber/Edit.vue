<template>
    <div class="col-12">
        <h2>Conta à Receber</h2>
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
                <label>Cliente</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="onSearchCliente" readonly/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="clienteSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1">Buscar</b-button>
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
                        <b-button v-b-modal.modal-consult-forma class="btn btn-info ml-1">Buscar</b-button>
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
                <label>Data de Cadastro</label>
                <input id="dataCadastro" type="text" class="form-control" v-model="dtCad" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Alteração</label>
                <input id="dataAlteracao" type="text" class="form-control" v-model="dtAlt" readonly/>
            </div>

            <div class="col-8">
                <div class="text-right">
                    <router-link :to="{name: 'PaisesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ClientesService} from '@/services/clientes.service'
import {FormasPagamentoService} from '@/services/formasPagamento.service'
// import {TheMask} from 'vue-the-mask'
// import Helper from '@/components/helper'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "ContasReceberEdit",
    props: {
        conta: {
            type: Object,
            default: null
        },    
    },
    // components: { TheMask },
    data() {
        return {
            entity: {
                modelo: null,
                serie: null,
                numeroNF: null,
                codigoCliente: 0,
                numeroParcela: 0,
                valorParcela: null,
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
                    vm.findCompra();
                }).catch(function() {
                    vm.entity.codigoCliente = 0;
                    vm.clienteSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Cliente não encontrada");
                    vm.findCompra();
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
        save() {
        }
    }
}
</script>