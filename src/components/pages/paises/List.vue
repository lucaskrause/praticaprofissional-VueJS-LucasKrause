<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Países</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'PaisesCad'}" class="btn btn-success">Novo País</router-link>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode mode="remote"
                    :totalRows="totalRecords"
                    :columns="columns"
                    :rows="rows"
                    :search-options="{enabled: true, placeholder: 'Busque por nome'}"
                    :pagination-options="{perPage: 5, enabled: true}"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <router-link :to="{name: 'PaisesEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {PaisesService} from '@/services/paises.service'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "PaisesList",
    components: { VueGoodTable },
    data () {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number",
                    width: '100px',
                },
                {
                    label: "País",
                    field: "pais"
                },
                {
                    label: "Sigla",
                    field: "sigla",
                    width: '100px',
                },
                {
                    label: "DDI",
                    field: "ddi",
                    type: "number",
                    width: '80px',
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: '160px',
                },
            ],
            page: 1,
            rows: [],
            totalRecords: 0
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            const vm = this;
            PaisesService.getAll().then(function (response) {
                vm.totalRecords = response.data.count;
                vm.rows = response.data;
            });
        },
        remove(codigo) {
            var vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                PaisesService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("País excluído com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possível excluir o pais");
                    }
                });
            }
        }
    }
}
</script>