<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Contas à Receber</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ContasReceberCad'}" class="btn btn-success">Nova Conta à Receber</router-link>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode
                    :totalRows="totalRecords"
                    :columns="columns"
                    :rows="rows"
                    :search-options="{enabled: true, placeholder: 'Buscar'}"
                    :pagination-options="{perPage: 10, enabled: true}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <router-link :to="{name: 'ContasReceberView', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Ver</router-link>
                            <router-link :to="{name: 'ContasReceberEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-success">Editar</router-link>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {ContasReceberService} from '@/services/contasReceber.service'
import Helper from '@/components/helper'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'

export default {
    name: "ContasReceberList",
    components: { VueGoodTable },
    data() {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number",
                    width: "100px",
                },
                {
                    label: "Cliente",
                    field: "cliente.nome"
                },
                {
                    label: "Nº Parcela",
                    field: "numeroParcela",
                    type: "number",
                    width: "130px",
                },
                {
                    label: "Forma Pagamento",
                    field: "formaPagamento.descricao"
                },
                {
                    label: "Valor",
                    field: "valorParcela",
                    type: "number",
                    width: "150px",
                },
                {
                    label: "Vencimento",
                    field: "dtVencimento",
                    type: "date",
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'dd/MM/yyyy',
                    width: "150px",
                },
                {
                    label: "Status",
                    field: "status",
                    width: "150px",
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "140px",
                },
            ],
            rows: [],
            page: 1,
            totalRecords: 0
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            const vm = this;
            ContasReceberService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;

                for (var i=0; i < vm.rows.length; i++) {
                    vm.rows[i].dtVencimento = Helper.dateToDateString(vm.rows[i].dtVencimento);
                    vm.rows[i].valorParcela = Helper.number_format(vm.rows[i].valorParcela);
                }
            });
        },
    }
}
</script>