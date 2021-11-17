<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Dependentes</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'DependentesCad'}" class="btn btn-success">Novo Dependente</router-link>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode
                    :totalRows="totalRecords"
                    :columns="columns"
                    :rows="rows"
                    :search-options="{enabled: true, placeholder: 'Buscar'}"
                    :pagination-options="{perPage: 10, enabled: true}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <router-link :to="{name: 'DependentesEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {DependentesService} from '@/services/dependentes.service'
import Helper from '@/components/helper'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "DependentesList",
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
                    width: "150px",
                },
                {
                    label: "Telefone",
                    field: "telefone",
                    width: "150px",
                },
                {
                    label: "Sócio",
                    field: "cliente.nome"
                },
                {
                    label: "Ação",
                    field: "btn",
                    sortable: false,
                    html: true,
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
            DependentesService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;

                for (let i = 0; i < vm.rows.length; i++) {
                    vm.rows[i].cpf = Helper.addMaskCPF(vm.rows[i].cpf);
                }
            });
        },
        remove(codigo) {
            const vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                DependentesService.delete(codigo).then(function (response) {
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