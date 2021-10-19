<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-condicao class="btn btn-success ml-1">Novo Condição de Pagamento</b-button>
        </div>
        
        <div class="col-12 mt-2">
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
                        <a @click.prevent="selectCondicao(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-condicao" size="xl" title="Cadastrar Condição de Pagamento" hide-footer>
            <NovoCondicaoPagamento  @emit-condicao="selectCondicao" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import NovoCondicaoPagamento from '@/components/pages/condicoesPagamento/Edit.vue'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "CondicoesPagamentosConsult",
    components: { VueGoodTable, NovoCondicaoPagamento },
    data() {
        return {
             columns: [
                {
                    label: "Código",
                    field: "codigo"
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
                }
            ],
            page: 1,
            rows: [],
            totalRecords: 0
        }
    },
    created() {
        const vm = this;
        CondicoesPagamentoService.getAll().then(function (response) {
            vm.totalRecords = response.data.length;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectCondicao(entity) {
            this.$emit('emit-condicao', entity);
        }
    }
}
</script>