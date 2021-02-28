<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h1>Estados</h1></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'EstadosCad'}" class="btn btn-success">Novo Estado</router-link>
            </div>
        </div>
        <div class="row">
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
    name: "EstadosList",
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
                    label: "Estado",
                    field: "estado"
                },
                {
                    label: "UF",
                    field: "uf"
                },
                {
                    label: "País",
                    field: "pais"
                },
            ],
            rows: [],
            page: 1,
            totalRecords: 0
        }
    },
}
</script>