<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Consumos</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ConsumosCad'}" class="btn btn-success">Novo Consumo</router-link>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode
                    :columns="columns"
                    :rows="rows"
                    :search-options="{enabled: true}"
                    :pagination-options="{perPage: 10, enabled: true}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <router-link :to="{name: 'ConsumosEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {ConsumosService} from '@/services/consumos.service'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "ConsumosList",
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
                    label: "Produto",
                    field: "produto.produto",
                },
                {
                    label: "Quantidade",
                    field: "quantidade",
                    type: "number",
                    width: '150px',
                },
                {
                    label: "Funcionário",
                    field: "funcionario.nome"
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
            ConsumosService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;
            });
        },
        remove(codigo) {
            var vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                ConsumosService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("Consumo excluído com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possível excluir o consumo");
                    }
                }).catch(function (errors){
                    notyf.error(errors.response.data.message);
                });
            }
        }
    }
}
</script>