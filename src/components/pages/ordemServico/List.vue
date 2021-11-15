<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Ordens de Serviço</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'OrdensServicoCad'}" class="btn btn-success">Nova Ordem de Serviço</router-link>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode
                    :columns="columns"
                    :rows="rows"
                    :search-options="{enabled: true}"
                    :pagination-options="{perPage: 10, enabled: true}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <router-link :to="{name: 'OrdensServicoEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {OrdensServicoService} from '@/services/ordensServico.service'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "OrdensServicoList",
    components: { VueGoodTable },
    data () {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number",
                    width: '100px',
                },
                {
                    label: "Fornecedor",
                    field: "fornecedor.nome",
                },
                {
                    label: "Valor",
                    field: "valorTotal",
                    type: "number",
                    width: '150px',
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: '160px',
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
            OrdensServicoService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;
            });
        }
    }
}
</script>