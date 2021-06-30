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
                <input id="qtdePessoas" type="number" class="form-control" v-model.number="entity.qtdePessoas" @input="calcValor"
                    :class="{'is-invalid': $v.entity.qtdePessoas.$error, 'd-none': isLoading}"/>
                <div class="invalid-feedback" v-if="!$v.entity.qtdePessoas.minValue || !$v.entity.qtdePessoas.maxValue">
                    Quantidade deve estar entre 1 e 70 Pessoas
                </div>
            </div>

            <div class="col-3">
                <label>Data da Reserva</label>
                <input id="dtReserva" type="date" class="form-control" v-uppercase v-model.lazy="entity.dtReserva"
                    :class="{'is-invalid': $v.entity.dtReserva.$error, 'd-none': isLoading}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtReserva.required">
                    Data da Reserva obrigatória
                </div>
            </div>

            <div class="col-2">
                <label>Valor</label>
                <input id="valor" type="number" class="form-control" v-model.number="entity.valor" disabled/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>País</label>
                <div class="input-group">
                   <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="searchCliente"
                        :class="{'is-invalid': $v.entity.codigoCliente.$error, 'd-none': isLoading}"/>
                    <div class="input-group-append">
                        <input id="cliente" type="text" class="form-control" v-model.lazy="clienteSelecionado" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCliente.minValue">
                        Selecione um Cliente
                    </div>
                </div>
            </div>
            
            <div class="col-5">
                <label>Condição de Pagamento</label>
                <div class="input-group">
                   <input id="codigoCondicaoPagamento" type="number" class="form-control" v-model.number="entity.codigoCondicaoPagamento" @input="searchCondicao"
                        :class="{'is-invalid': $v.entity.codigoCondicaoPagamento.$error, 'd-none': isLoading}"/>
                    <div class="input-group-append">
                        <input id="condicaoPagamento" type="text" class="form-control" v-uppercase v-model.lazy="condicaoSelecionada" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-condicaoPagamento class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCondicaoPagamento.minValue">
                        Selecione uma Condição de Pagamento
                    </div>
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

        <b-modal id="modal-consult-condicaoPagamento" size="xl" title="Consultar Condição de Pagamento" hide-footer>
            <ConsultaCondicaoPagamento @emit-condicao="selectCondicao" />
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minValue, maxValue} from 'vuelidate/lib/validators'
import {ClientesService} from '@/services/clientes.service'
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import {AreasLocacaoService} from '@/services/areasLocacao.service'
import {PrecificacoesService} from '@/services/precificacoes.service'
import {ReservasService} from '@/services/reservas.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import ConsultaCondicaoPagamento from '@/components/pages/condicoesPagamento/Consult.vue'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import Helper from '@/components/helper'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ReservasEdit",
    components: { VueGoodTable, ConsultaCliente, ConsultaCondicaoPagamento },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                codigoCliente: {
                    minValue: minValue(1),
                },
                qtdePessoas: {
                    minValue: minValue(1),
                    maxValue: maxValue(70),
                },
                dtReserva: {
                    required,
                },
                codigoCondicaoPagamento: {
                    minValue: minValue(1),
                }
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                codigoCliente: 0,
                qtdePessoas: 0,
                dtReserva: null,
                valor: 0,
                codigoCondicaoPagamento: 0,
                areasLocacao: [],
                dtCadastro: null,
                dtAlteracao: null
            },
            clienteSelecionado: null,
            condicaoSelecionada: null,
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
                ],
                rows: [],
                page: 1,
                totalRecords: 0
            },
            isCreate: false,
            precoPessoas: [],
            valorPessoas: 0,
            valorAreas: 0,
            isLoading: false,
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
    methods: {
        getReserva(id) {
            var vm = this;
            ReservasService.getById(id).then(function (response) {
                vm.entity = response.data;
                
                var dateReserva = Helper.dateToDateString(vm.entity.dtReserva);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                vm.entity.dtReserva = dateReserva;
                vm.entity.dtCadastro = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.entity.dtAlteracao = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.clienteSelecionado = vm.entity.cliente.nome;
                vm.condicaoSelecionada = vm.entity.condicaoPagamento.descricao;
                
                vm.isCreate = true;
                vm.areasLocacao.rows = vm.areasLocacao.rows.map(function (item) {
                    item.vgtSelected = vm.entity.areasLocacao.some((area) => area.codigo == item.codigo);
                    return item;
                });
                vm.isCreate = false;
            });
        },
        selectCliente(entity) {
            this.clienteSelecionado = entity.nome;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consult-cliente");
        },
        selectCondicao(entity) {
            this.condicaoSelecionada = entity.descricao;
            this.entity.codigoCondicaoPagamento = entity.codigo;
            this.$bvModal.hide("modal-new-condicaoPagamento");
            this.$bvModal.hide("modal-consult-condicaoPagamento");
        },
        searchCliente() {
            var vm = this;
            if (vm.entity.codigoCliente > 0) {
                ClientesService.getById(vm.entity.codigoCliente).then(function (response) {
                    vm.clienteSelecionado = response.data.nome;
                }).catch(function() {
                    vm.entity.codigoCliente = 0;
                    vm.clienteSelecionado = null;
                    notyf.error("Cliente não encontrada");
                });
            } else {
                vm.clienteSelecionado = null;
            }
        },
        searchCondicao() {
            var vm = this;
            if (vm.entity.codigoCondicaoPagamento > 0) {
                CondicoesPagamentoService.getById(vm.entity.codigoCondicaoPagamento).then(function (response) {
                    vm.condicaoSelecionada = response.data.descricao;
                }).catch(function() {
                    vm.entity.codigoCondicaoPagamento = 0;
                    vm.condicaoSelecionada = null;
                    notyf.error("Condição de Pagamento não encontrada");
                });
            } else {
                vm.condicaoSelecionada = null;
            }
        },
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            this.$v.$touch();
            console.log(this.$v.entity.areasLocacao);
            const vm = this;

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }

            if (this.entity.areasLocacao.length == 0) {
                notyf.error("Selecione pelo menos uma área para locação");
                return;
            }

            ReservasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editada" : 'criada';
                notyf.success("Reserva " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/reservas');
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        },
        calcValor() {
            this.valorPessoas = 0;
            var value = this.entity.qtdePessoas;
            for (let i=0; i < this.precoPessoas.length; i++) {
                var max = this.precoPessoas[i].maxPessoas;
                if (value > max) {
                    continue;
                } else {
                    var valor = this.precoPessoas[i].valor;
                    this.valorPessoas = value * valor;
                }
            }
            this.entity.valor = this.valorPessoas + this.valorAreas;
        },
        selecionarAreas(areas) {
            if (this.isCreate) {
                var selecionadas = areas.selectedRows;
                this.entity.areasLocacao = selecionadas;
                this.valorAreas = 0;

                for (let i = 0; i < selecionadas.length; i++) {
                    this.valorAreas += selecionadas[i].valor;
                }

                this.calcValor();
            }
        }
    }
}
</script>