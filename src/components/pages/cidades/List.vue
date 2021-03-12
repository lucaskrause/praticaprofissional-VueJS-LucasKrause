<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Cidades</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'CidadesCad'}" class="btn btn-success">Nova Cidade</router-link>
            </div>
        </div>
        
        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table
                    compactMode
                    :columns="columns"
                    :rows="rows"
                    :search-options="{enabled: false}"
                    :pagination-options="{perPage: 5, enabled: true}"
                >
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';

export default {
    name: "CidadesList",
    components: { VueGoodTable },
    data () {
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
                    label: "Estado",
                    field: "estado"
                },
            ],
            rows: [],
            page: 1,
            totalRecords: 0
        }
    },
}
</script>