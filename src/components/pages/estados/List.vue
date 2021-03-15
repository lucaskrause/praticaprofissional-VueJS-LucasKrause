<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Estados</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'EstadosCad'}" class="btn btn-success">Novo Estado</router-link>
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
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <router-link :to="{name: 'EstadosEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {EstadosService} from '@/services/estados.service'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

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
                // {
                //     label: "País",
                //     field: "pais"
                // },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true
                },
            ],
            rows: [],
            page: 1,
            totalRecords: 0
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            const vm = this;
            EstadosService.getAll().then(function (data) {
                vm.totalRecords = data.data.count;
                vm.rows = data.data;
            });
        },
        remove(codigo) {
            const vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                EstadosService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("Estado excluido com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possivel excluir o estado");
                    }
                });
            }
        }
    }
}
</script>