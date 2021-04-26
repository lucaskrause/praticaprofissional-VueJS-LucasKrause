<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-formaPagamento class="btn btn-success ml-1">Nova Forma de Pagamento</b-button>
        </div>
        
        <div class="col-12 mt-2">
            <vue-good-table compactMode mode="remote"
                :totalRows="totalRecords"
                :columns="columns"
                :rows="rows"
                :search-options="{enabled: true, placeholder: 'Busque por nome'}"
                :pagination-options="{perPage: 5, enabled: true}"
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
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

export default {
    components: { VueGoodTable, NovaFormaPagamento },
    data() {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: 'number'
                },
                {
                    label: "Forma de Pagamento",
                    field: "descricao"
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
        const vm = this;
        FormasPagamentoService.getAll().then(function (data) {
            vm.totalRecords = data.data.count;
            vm.rows = data.data; 
        });
    },
    methods: {
        selectForma(entity) {
            this.$emit('emit-forma', entity);
        }
    }
}
</script>