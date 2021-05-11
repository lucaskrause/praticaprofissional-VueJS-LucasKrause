<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-contaBancaria class="btn btn-success ml-1">Nova Conta Bancaria</b-button>
        </div>
        
        <div class="col-12 mt-2">
            <vue-good-table compactMode mode="remote"
                :totalRows="totalRecords"
                :columns="columns"
                :rows="rows"
                :search-options="{enabled: true, placeholder: 'Busque por Banco'}"
                :pagination-options="{perPage: 5, enabled: true}"
            >
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'btn'">
                        <a @click.prevent="selectContasBancaria(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-contaBancaria" size="xl" title="Cadastrar ContasBancaria" hide-footer>
            <NovaContaBancaria  @emit-contaBancaria="selectContasBancaria" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {ContasBancariasService} from '@/services/contasBancarias.service'
import NovaContaBancaria from '@/components/pages/contasBancarias/Edit.vue'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "ContasBancariasConsult",
    components: { VueGoodTable, NovaContaBancaria },
    data() {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number"
                },
                {
                    label: "Banco",
                    field: "banco"
                },
                {
                    label: "Agência",
                    field: "agencia"
                },
                {
                    label: "Conta",
                    field: "conta"
                },
                {
                    label: "Número do Banco",
                    field: "numeroBanco"
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
        ContasBancariasService.getAll().then(function (response) {
            vm.totalRecords = response.data.count;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectContasBancaria(entity) {
            this.$emit('emit-contaBancaria', entity);
        }
    }
}
</script>