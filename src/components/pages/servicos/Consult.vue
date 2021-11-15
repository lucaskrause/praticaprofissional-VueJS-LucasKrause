<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-servico class="btn btn-success ml-1">Novo Serviço</b-button>
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
                        <a @click.prevent="selectServico(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-servico" size="xl" title="Cadastrar Serviço" hide-footer>
            <NovoServico  @emit-servico="selectServico" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {ServicosService} from '@/services/servicos.service'
import NovoServico from '@/components/pages/servicos/Edit.vue'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "ServiçosConsult",
    components: { VueGoodTable, NovoServico },
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
                    label: "Serviço",
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
        ServicosService.getAll().then(function (response) {
            vm.totalRecords = response.data.length;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectServico(entity) {
            this.$emit('emit-servico', entity);
        }
    }
}
</script>