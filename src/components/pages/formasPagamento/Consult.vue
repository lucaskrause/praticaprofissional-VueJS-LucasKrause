<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-formaPagamento class="btn btn-success ml-1">Nova Forma de Pagamento</b-button>
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
                        <a @click.prevent="selectForma(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-formaPagamento" size="xl" title="Cadastrar Forma de Pagamento" hide-footer>
            <NovaFormaPagamento  @emit-forma="selectForma" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {FormasPagamentoService} from '@/services/formasPagamento.service'
import NovaFormaPagamento from '@/components/pages/formasPagamento/Edit.vue'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "FormasPagamentoConsult",
    components: { VueGoodTable, NovaFormaPagamento },
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
                    label: "Forma de Pagamento",
                    field: "descricao"
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "100px",
                },
            ],
            page: 1,
            rows: [],
            totalRecords: 0
        }
    },
    created() {
        const vm = this;
        FormasPagamentoService.getAll().then(function (response) {
            vm.totalRecords = response.data.length;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectForma(entity) {
            this.$emit('emit-forma', entity);
        }
    }
}
</script>