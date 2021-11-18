<template>
    <div class="col-12">
        <h2>Conta à Receber</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Cliente</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" readonly/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="clienteSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1" disabled>Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-1">
                <label>Nº Parcela</label><span class="isRequired"> *</span>
                <input id="numeroParcela" type="number" class="form-control" v-model="entity.numeroParcela" readonly/>
            </div>

            <div class="col-2">
                <label>Valor Parcela</label><span class="isRequired"> *</span>
                <money id="valorParcela" class="form-control text-right" v-bind="money" v-model.number="entity.valorParcela" readonly></money>
            </div>
        </div>

        <div class="row form-group">
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
                    <router-link :to="{name: 'ContasReceberList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Receber" class="btn btn-success" @click.prevent="receber()" :class="{'disabled': isSubmiting}" :disabled="entity.status != 'Pendente'">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ContasReceberService} from '@/services/contasReceber.service'
import {Money} from 'v-money'
import Helper from '@/components/helper'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "ContasReceberView",
    components: { Money },
    data() {
        return {
            entity: {
                codigo: 0,
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
        const vm = this;
        if (this.$route.params.codigo > 0) {
            this.entity.codigo = parseInt(this.$route.params.codigo);

            ContasReceberService.getParcela(this.entity).then(function (response) {
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
    },
    methods: {
        receber() {
            if (this.isSubmiting) return;

            this.isSubmiting = true;
            const vm = this;

            ContasReceberService.receber(this.entity).then(function () {
                notyf.success("Conta recebida com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/contasReceber');

            }).catch((error) => Helper.saveErrorCallBack(error.response));
        }
    }
}
</script>