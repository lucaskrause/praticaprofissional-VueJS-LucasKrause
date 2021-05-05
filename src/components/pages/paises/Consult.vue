<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-pais class="btn btn-success ml-1">Novo País</b-button>
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
                        <a @click.prevent="selectPais(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-pais" size="xl" title="Cadastrar País" hide-footer>
            <NovoPais  @emit-pais="selectPais" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {PaisesService} from '@/services/paises.service'
import NovoPais from '@/components/pages/paises/Edit.vue'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "PaisesConsult",
    components: { VueGoodTable, NovoPais },
    data() {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number"
                },
                {
                    label: "País",
                    field: "pais"
                },
                {
                    label: "Sigla",
                    field: "sigla"
                },
                {
                    label: "DDI",
                    field: "ddi",
                    type: "number"
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
        PaisesService.getAll().then(function (response) {
            vm.totalRecords = response.data.count;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectPais(entity) {
            this.$emit('emit-pais', entity);
        }
    }
}
</script>