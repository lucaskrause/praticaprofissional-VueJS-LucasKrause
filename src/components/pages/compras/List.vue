<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Compras</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ComprasCad'}" class="btn btn-success">Nova Compra</router-link>
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
                            <router-link :to="{name: 'ComprasEdit', params: {compra: props.row, isEdit: true}}" class="btn btn-sm btn-success mr-3">Ver</router-link>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {ComprasService} from '@/services/compras.service'
import Helper from '@/components/helper'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'

export default {
    name: "ComprasList",
    components: { VueGoodTable },
    data() {
        return {
            columns: [
                {
                    label: "Modelo",
                    field: "modelo",
                    type: "number",
                    width: "100px",
                },
                {
                    label: "Série",
                    field: "serie",
                    type: "number",
                    width: "100px",
                },
                {
                    label: "Número Nota Fiscal",
                    field: "numeroNF",
                    type: "number",
                    width: "200px",
                },
                {
                    label: "Fornecedor",
                    field: "fornecedor.nome"
                },
                {
                    label: "Emissão",
                    field: "dtEmissao",
                    type: "date",
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'dd/MM/yyyy',
                    width: "150px",
                },
                {
                    label: "Entrega",
                    field: "dtEntrega",
                    type: "date",
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'dd/MM/yyyy',
                    width: "150px",
                },
                {
                    label:"Valor",
                    field: "valorApresentavel",
                    type: "number",
                    width: "120px"
                },
                {
                    label:"Situação",
                    field: "status",
                    width: "120px"
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "80px"
                }
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
            ComprasService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;

                for (var i=0; i < vm.rows.length; i++) {
                    vm.rows[i].dtEmissao = Helper.dateToDateString(vm.rows[i].dtEmissao);                        
                    vm.rows[i].dtEntrega = Helper.dateToDateString(vm.rows[i].dtEntrega);
                    vm.rows[i].valorApresentavel = Helper.number_format(vm.rows[i].valorTotal);
                }
            });
        },
    }
}
</script>