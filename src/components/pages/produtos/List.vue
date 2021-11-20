<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Produtos</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ProdutosCad'}" class="btn btn-success">Novo Produto</router-link>
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
                            <router-link :to="{name: 'ProdutosEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import Helper from '@/components/helper'
import {ProdutosService} from '@/services/produtos.service'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "ProdutosList",
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
                    label: "Produto",
                    field: "produto"
                },
                {
                    label: "Categoria",
                    field: "categoria.descricao",
                    width: "180px",
                },
                {
                    label: "Unidades",
                    field: "unidades",
                    type: "number",
                    width: "120px",
                },
                {
                    label: "Valor de Custo",
                    field: "valorCusto",
                    type: "number",
                    width: "150px",
                },
                {
                    label: "Ações",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "160px",
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
            ProdutosService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;

                for (var i=0; i < vm.rows.length; i++) {
                    vm.rows[i].valorCusto = Helper.number_format(vm.rows[i].valorCusto);
                }
            });
        },
        remove(codigo) {
            const vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove) {
                ProdutosService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("Produto excluido com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possivel excluir o produto");
                    }
                });
            }
        }
    }
}
</script>