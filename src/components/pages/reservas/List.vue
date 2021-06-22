<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Reservas</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ReservasCad'}" class="btn btn-success">Nova Reserva</router-link>
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
                            <router-link :to="{name: 'ReservasEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import {ReservasService} from '@/services/reservas.service'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "CotasList",
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
                    label: "Cliente",
                    field: "cliente.nome"
                },
                {
                    label: "Qtde Pessoas",
                    field: "qtdePessoas",
                    type: "number",
                    width: "150px",
                },
                {
                    label: "Data da Reserva",
                    field: "dtReserva",
                    width: "200px",
                },
                {
                    label:"Ação",
                    sortable: false,
                    field: 'btn',
                    html: true,
                    width: "160px",
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
            ReservasService.getAll().then(function (response) {
                vm.totalRecords = response.data.length;
                vm.rows = response.data;
            });
        },
        remove(codigo) {
            var vm = this;
            var remove = confirm("Deseja realmente excluir?");
            if(remove){
                ReservasService.delete(codigo).then(function (response) {
                    if(response.data){
                        notyf.success("Cota excluída com sucesso");
                        vm.loadData();
                    } else {
                        notyf.error("Não foi possível excluir a cota");
                    }
                });
            }
        }
    }
}
</script>