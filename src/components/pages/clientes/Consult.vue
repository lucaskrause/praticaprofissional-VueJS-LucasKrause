<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-cliente class="btn btn-success ml-1">Novo Cliente</b-button>
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
                        <a @click.prevent="selectCliente(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-cliente" size="xl" title="Cadastrar Cliente" hide-footer>
            <NovoCliente  @emit-cliente="selectCliente" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {ClientesService} from '@/services/clientes.service'
import NovoCliente from '@/components/pages/clientes/Edit.vue'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "ClientesConsult",
    components: { VueGoodTable, NovoCliente },
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
                    label: "Nome",
                    field: "nome"
                },
                {
                    label: "CPF / CNPJ",
                    field: "cpfCnpj",
                    width: "180px",
                },
                {
                    label: "Telefone",
                    field: "telefone",
                    width: "160px",
                },
                {
                    label: "Ação",
                    field: "btn",
                    width: "160px",
                }
            ],
            page: 1,
            rows: [],
            totalRecords: 0
        }
    },
    created() {
        const vm = this;
        ClientesService.getAll().then(function (response) {
            vm.totalRecords = response.data.length;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectCliente(entity) {
            this.$emit('emit-cliente', entity);
        }
    }
}
</script>