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
                        <a @click.prevent="selectEstado(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
            </vue-good-table>
        </div>
    </div>
</template>

<script>
import {CidadesService} from '@/services/cidades.service'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'

export default {
    components: { VueGoodTable },
    data() {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: 'number'
                },
                {
                    label: "Cidade",
                    field: "cidade"
                },
                {
                    label: "DDD",
                    field: "ddd"
                },
                // {
                //     label: "UF",
                //     field: "uf"
                // },
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
        CidadesService.getAll().then(function (data) {
            vm.totalRecords = data.data.count;
            vm.rows = data.data; 
        });
    },
    methods: {
        selectCidade(entity) {
            this.$emit('emit-cidade', entity);
        }
    }
}
</script>