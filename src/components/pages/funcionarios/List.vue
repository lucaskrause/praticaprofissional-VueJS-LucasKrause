<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Funcionários</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'FuncionariosCad'}" class="btn btn-success">Novo Funcionário</router-link>
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
                            <router-link :to="{name: 'FuncionariosEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {FuncionariosService} from '@/services/funcionarios.service';
import 'vue-good-table/dist/vue-good-table.css';
import {VueGoodTable} from 'vue-good-table';
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "FuncionariosList",
    components: { VueGoodTable },
    data () {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number",
                    width: "100px",
                },
                {
                    label: "Nome",
                    field: "nome"
                },
                {
                    label: "CPF",
                    field: "cpf",
                    width: "160px",
                },
                {
                    label: "Telefone",
                    field: "telefone",
                    width: "160px",
                },
                {
                    label: "Ação",
                    field: "btn",
                    width: "160px",
                }
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
            FuncionariosService.getAll().then(function (response) {
                vm.totalRecords = response.data.count;
                vm.rows = response.data;
            });
        },
        remove(codigo) {
            const vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                FuncionariosService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("Dependente excluido com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possivel excluir o dependente");
                    }
                });
            }
        }
    }
}
</script>