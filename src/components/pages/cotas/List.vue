<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Cotas</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'CotasCad'}" class="btn btn-success">Nova Cota</router-link>
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
                            <router-link :to="{name: 'CotasEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {CotasService} from '@/services/cotas.service'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import Helper from '@/components/helper'

export default {
    name: "CotasList",
    components: { VueGoodTable },
    data () {
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
                    field: "cliente.nome",
                },
                {
                    label: "Valor",
                    field: "valor",
                    type: "number",
                    width: "150px",
                },
                {
                    label: "Data de Início",
                    field: "dtInicio",
                    type: "date",
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'dd/MM/yyyy',
                    width: "180px",
                },
                {
                    label: "Data de Termino",
                    field: "dtTermino",
                    type: "date",
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'dd/MM/yyyy',
                    width: "180px",
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "160px",
                },
            ],
            page: 1,
            rows: [],
            totalRecords: 0
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            const vm = this;
            CotasService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;

                for (var i=0; i < vm.rows.length; i++) {
                    vm.rows[i].valor = Helper.number_format(vm.rows[i].valor);
                }

                for (let i = 0; i < vm.totalRecords; i++) {
                    var dateInicio = Helper.dateToDateString(vm.rows[i].dtInicio);
                    var dateTermino = Helper.dateToDateString(vm.rows[i].dtTermino);

                    vm.rows[i].dtInicio = dateInicio;
                    vm.rows[i].dtTermino = dateTermino;
                }
            });
        },
    }
}
</script>