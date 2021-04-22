<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Clientes</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ClientesCad'}" class="btn btn-success">Novo Cliente</router-link>
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
    name: "ClientesList",
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
                    label: "Nome",
                    field: "nome"
                },
                {
                    label: "CPF / CNPJ",
                    field: "cpf_cnpj"
                },
                {
                    label: "Telefone",
                    field: "telefone"
                },
                {
                    label: "Tipo",
                    field: "tipo"
                }
            ],
            rows: [],
            page: 1,
            totalRecords: 0
        }
    },
}
</script>