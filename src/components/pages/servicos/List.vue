<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Serviços</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ServicosCad'}" class="btn btn-success">Novo Serviço</router-link>
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
                            <router-link :to="{name: 'ServicosEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {ServicosService} from '@/services/servicos.service'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ServicosList",
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
                    label: "Serviço",
                    field: "descricao"
                },
                {
                    label: "Valor",
                    field: "valor",
                    type: "decimal", 
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
            ServicosService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;
            });
        },
        remove(codigo) {
            const vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove) {
                ServicosService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("Serviço excluido com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possivel excluir o serviço");
                    }
                });
            }
        }
    }
}
</script>