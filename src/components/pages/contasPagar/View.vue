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
                    <input id="codigoFornecedor" type="number" class="form-control" v-model.number="entity.codigoFornecedor" readonly/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="fornecedorSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-fornecedor class="btn btn-info ml-1" disabled>Buscar</b-button>
                    </span>
                </div>
            </div>
            
            <div class="col-1">
                <label>Nº Parcela</label><span class="isRequired"> *</span>
                <input id="numeroParcela" type="number" class="form-control" v-model.number="entity.numeroParcela" readonly/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Valor Parcela</label><span class="isRequired"> *</span>
                <money id="valorParcela" class="form-control text-right" v-bind="money" v-model.number="entity.valorParcela" readonly></money>
            </div>

            <div class="col-4">
                <label>Forma de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFormaPagamento" type="number" class="form-control" v-model.number="entity.codigoFormaPagamento" readonly/>
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
                    <input type="submit" value="Pagar" class="btn btn-success" @click.prevent="pagar()" :class="{'disabled': isSubmiting}" :disabled="entity.status != 'Pendente'">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ContasPagarService} from '@/services/contasPagar.service'
import {Money} from 'v-money'
import Helper from '@/components/helper'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "ContasPagarView",
    components: { Money },
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
        if (this.conta) {
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
    },
    methods: {
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