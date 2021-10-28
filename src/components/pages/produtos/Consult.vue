<template>
    <div class="row">
        <div class="col-12 text-right">
            <b-button v-b-modal.modal-new-produto class="btn btn-success ml-1">Novo Produto</b-button>
        </div>
        
        <div class="col-12 mt-2">
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
                        <a @click.prevent="selectProduto(props.row)" class="btn btn-sm btn-primary" href="#">Selecionar</a>
                    </span>
                </template>
			</vue-good-table>
        </div>
        
		<b-modal id="modal-new-produto" size="xl" title="Cadastrar Produto" hide-footer>
			<NovoProduto  @emit-produto="selectProduto" :isModal="true" />
		</b-modal>
    </div>
</template>

<script>
import {ProdutosService} from '@/services/produtos.service'
import NovoProduto from '@/components/pages/produtos/Edit.vue'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

export default {
    name: "ProdutosConsult",
    components: { VueGoodTable, NovoProduto },
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
                    width: "150px",
                },
                {
                    label: "Ações",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "100px",
                },
            ],
            page: 1,
            rows: [],
            totalRecords: 0
        }
    },
    created() {
        const vm = this;
        ProdutosService.getAll().then(function (response) {
            vm.totalRecords = response.data.length;
            vm.rows = response.data; 
        });
    },
    methods: {
        selectProduto(entity) {
            this.$emit('emit-produto', entity);
        }
    }
}
</script>