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
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <router-link :to="{name: 'ClientesEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {ClientesService} from '@/services/clientes.service';
import 'vue-good-table/dist/vue-good-table.css';
import {VueGoodTable} from 'vue-good-table';
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ClientesList",
    components: { VueGoodTable },
    data () {
        return {
            columns: [
                {
                    label: "Código",
                    field: "codigo",
                    type: "number"
                },
                {
                    label: "Nome",
                    field: "nome"
                },
                {
                    label: "CPF / CNPJ",
                    field: "cpfCnpj"
                },
                {
                    label: "Telefone",
                    field: "telefone"
                },
                {
                    label: "Tipo",
                    field: "tipoPessoa"
                },
                {
                    label: "Ação",
                    field: "btn"
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
            ClientesService.getAll().then(function (response) {
                vm.totalRecords = response.data.count;
                vm.rows = response.data;
            });
        },
        remove(codigo) {
            const vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                ClientesService.delete(codigo).then(function (response) {
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