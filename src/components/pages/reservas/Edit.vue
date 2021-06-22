<template>
    <div class="col-12">
        <h2>Reservar</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-2">
                <label>Código da Reserva</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>
            
            <div class="col-3 form-group">
                <label>Quantidade de Pessoas</label>
                <input id="qtdePessoas" type="number" class="form-control" v-model.number="entity.qtdePessoas"/>
            </div>

            <div class="col-3">
                <label>Data da Reserva</label>
                <input id="dtReserva" type="date" class="form-control" v-uppercase v-model.lazy="entity.dtReserva"/>
            </div>

            <div class="col-2">
                <label>Valor</label>
                <input id="valor" type="number" class="form-control" v-model.number="entity.valor" disabled/>
            </div>
        </div>
        
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" readonly/>
            </div>

            <div class="col-4">
                <label>Cliente</label>
                <div class="input-group">
                    <input id="cliente" type="text" class="form-control" v-model.lazy="clienteSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-3">
                <label>Áreas de Locação</label>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-12">
                <vue-good-table compactMode ref="areas"
                    :name="areasLocacao"
                    @on-selected-rows-change="selecionarAreas"
                    :columns="areasLocacao.columns"
                    :rows="areasLocacao.rows"
                    :search-options="{enabled: false, placeholder: 'Buscar'}"
                    :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Áreas selecionadas', clearSelectionText: 'Limpar',}"
                    :pagination-options="{perPage: 10, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'select'">
                            <input type="checkbox" />
                        </span>
                    </template>
                    <!-- <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <a @click.prevent="EditConta(props.row.codigo)" class="btn btn-sm btn-primary mr-3" href="#">Editar</a>
                            <a @click.prevent="removeConta(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template> -->
                </vue-good-table>
            </div>
        </div>

        <div class="row form-group align-items-end mt-5">
            <div class="col-2">
                <label>Data de Cadastro</label>
                <input id="dataCadastro" type="text" class="form-control" v-model="entity.dtCadastro" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Alteração</label>
                <input id="dataAlteracao" type="text" class="form-control" v-model="entity.dtAlteracao" readonly/>
            </div>

            <div class="col-8">
                <div class="text-right">
                    <router-link :to="{name: 'ReservasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" />
        </b-modal>
    </div>
</template>

<script>
import {AreasLocacaoService} from '@/services/areasLocacao.service'
import {PrecificacoesService} from '@/services/precificacoes.service'
import {ReservasService} from '@/services/reservas.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import {VueGoodTable} from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ReservasEdit",
    components: { VueGoodTable, ConsultaCliente },
    data() {
        return {
            entity: {
                codigo: 0,
                codigoCliente: 0,
                qtdePessoas: 0,
                dtReserva: null,
                valor: 0,
                areasLocacao: [],
                dtCadastro: null,
                dtAlteracao: null
            },
            clienteSelecionado: null,
            areasLocacao: {
                columns: [
                    {
                        label: "Código",
                        field: "codigo",
                        type: "number",
                        width: "100px",
                    },
                    {
                        label: "Área",
                        field: "descricao"
                    },
                    {
                        label: "Valor",
                        field: "valor",
                        type: "decimal", 
                        width: "150px",
                    },
                    // {
                    //     label:"Ação",
                    //     sortable: false,
                    //     field: 'btn',
                    //     html: true,
                    //     width: "160px",
                    // },
                ],
                rows: [],
                page: 1,
                totalRecords: 0
            },
            precoPessoas: [],
            valorPessoas: 0,
            valorAreas: 0,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
        }
        
        PrecificacoesService.getAll().then(function (response) {
            vm.precoPessoas = response.data;
        });

        AreasLocacaoService.getAll().then(function (response) {
            vm.areasLocacao.rows = response.data;

            if (vm.entity.codigo) {
                vm.getReserva(vm.entity.codigo);
            }
        });
    },
    watch: {
        'entity.qtdePessoas'(value) {
            this.valorPessoas = 0;
            for (let i=0; i < this.precoPessoas.length; i++) {
                var min = this.precoPessoas[i].minPessoas;
                var max = this.precoPessoas[i].maxPessoas;
                if (value >= min && value <= max) {
                    var valor = this.precoPessoas[i].valor;
                    this.valorPessoas = value * valor;
                }
            }
            this.entity.valor = this.valorPessoas + this.valorAreas;
        }
    },
    methods: {
        getReserva(id) {
            var vm = this;
            ReservasService.getById(id).then(function (response) {
                vm.entity = response.data;
                vm.clienteSelecionado = vm.entity.cliente.nome;
                vm.areasLocacao.rows = vm.areasLocacao.rows.map(function (item) {
                    item.vgtSelected = vm.entity.areasLocacao.some((area) => area.codigo == item.codigo);
                    return item;
                });
            });
        },
        selectCliente(entity) {
            this.clienteSelecionado = entity.nome;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consult-cliente");
        },
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            console.log(this.$refs['areas'].selectedRows);
            if(vm) return;
            ReservasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editada" : 'criada';
                notyf.success("Reserva " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/reservas');
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        },
        selecionarAreas(areas) {
            var selecionadas = areas.selectedRows;
            this.entity.areasLocacao = selecionadas;
            this.valorAreas = 0;
            for (let i = 0; i < selecionadas.length; i++) {
                this.valorAreas += selecionadas[i].valor;
            }
            this.entity.valor = this.valorPessoas + this.valorAreas;
        }
    }
}
</script>