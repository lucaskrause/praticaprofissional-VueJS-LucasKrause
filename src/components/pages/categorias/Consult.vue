<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-categoria class="btn btn-success ml-1">Nova Categoria</b-button>
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
                        <a @click.prevent="selectCategoria(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-categoria" size="xl" title="Cadastrar Categoria" hide-footer>
            <NovaCategoria  @emit-categoria="selectCategoria" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {CategoriasService} from '@/services/categorias.service'
import NovaCategoria from '@/components/pages/categorias/Edit.vue'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "CategoriasConsult",
    components: { VueGoodTable, NovaCategoria },
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
                    label: "Categoria",
                    field: "descricao",
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
        CategoriasService.getAll().then(function (response) {
            vm.totalRecords = response.data.length;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectCategoria(entity) {
            this.$emit('emit-categoria', entity);
        }
    }
}
</script>