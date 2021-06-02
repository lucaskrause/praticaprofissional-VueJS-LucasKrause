<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-estado class="btn btn-success ml-1">Novo Estado</b-button>
        </div>
        
        <div class="col-12 mt-2">
            <vue-good-table compactMode 
                :totalRows="totalRecords"
                :columns="columns"
                :rows="rows"
                :search-options="{enabled: true, placeholder: 'Buscar'}"
                :pagination-options="{perPage: 5, enabled: true}"
            >
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'btn'">
                        <a @click.prevent="selectEstado(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>

        <b-modal id="modal-new-estado" size="xl" title="Cadastrar Estado" hide-footer>
            <NovoEstado  @emit-estado="selectEstado" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {EstadosService} from '@/services/estados.service'
import NovoEstado from '@/components/pages/estados/Edit.vue'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "EstadosConsult",
    components: {
        VueGoodTable, NovoEstado
    },
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
                    label: "Estado",
                    field: "estado"
                },
                {
                    label: "UF",
                    field: "uf",
                    width: "80px",
                },
                {
                    label: "País",
                    field: "pais.pais"
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
        EstadosService.getAll().then(function (response) {
            vm.totalRecords = response.data.length;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectEstado(entity) {
            this.$emit('emit-estado', entity);
        }
    }
}
</script>