<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Condições de Pagamento</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'CondicoesPagamentoCad'}" class="btn btn-success">Nova Condição de Pagamento</router-link>
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
                            <router-link :to="{name: 'CondicoesPagamentoEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "CondicoesPagamentosList",
    components: { VueGoodTable },
    data () {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number"
                },
                {
                    label: "Condição de Pagamento",
                    field: "descricao"
                },
                {
                    label: "Multa",
                    field: "multa"
                },
                {
                    label: "Juros",
                    field: "juros"
                },
                {
                    label: "Desconto",
                    field: "desconto"
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true
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
            CondicoesPagamentoService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;
            });
        },
        remove(codigo) {
            var vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                CondicoesPagamentoService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("Condição de Pagamento excluído com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possível excluir a Condição de Pagamento");
                    }
                });
            }
        }
    }
}
</script>