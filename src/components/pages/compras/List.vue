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
                            <router-link :to="{name: 'ComprasEdit', params: {compra: props.row}}" class="btn btn-sm btn-success mr-3">Ver</router-link>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {ComprasService} from '@/services/compras.service'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
//import {Notyf} from 'notyf';
//import 'notyf/notyf.min.css';

export default {
    name: "ComprasList",
    components: { VueGoodTable },
    data() {
        return {
            columns: [
                {
                    label: "Modelo",
                    field: "modelo"
                },
                {
                    label: "Série",
                    field: "serie"
                },
                {
                    label: "Número Nota Fiscal",
                    field: "numeroNF"
                },
                {
                    label: "Fornecedor",
                    field: "fornecedor.nome"
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "100px",
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
            ComprasService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;
            });
        },
    }
}
</script>