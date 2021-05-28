<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-cidade class="btn btn-success ml-1">Nova Cidade</b-button>
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
                        <a @click.prevent="selectCidade(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
        
        <b-modal id="modal-new-cidade" size="xl" title="Cadastrar Cidade" hide-footer>
            <NovaCidade  @emit-cidade="selectCidade" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {CidadesService} from '@/services/cidades.service'
import NovaCidade from '@/components/pages/cidades/Edit.vue'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "CidadesConsult",
    components: { VueGoodTable, NovaCidade },
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
                    label: "Cidade",
                    field: "cidade",
                },
                {
                    label: "DDD",
                    field: "ddd",
                    width: "80px",
                },
                {
                    label: "UF",
                    field: "estado.uf",
                    width: "80px",
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
        CidadesService.getAll().then(function (response) {
            vm.totalRecords = response.data.count;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectCidade(entity) {
            this.$emit('emit-cidade', entity);
        }
    }
}
</script>