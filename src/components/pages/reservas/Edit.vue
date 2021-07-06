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
                <label>Quantidade de Pessoas</label><span class="isRequired"> *</span>
                <input id="qtdePessoas" type="number" class="form-control" v-model.number="entity.qtdePessoas" @input="calcValor"
                    :class="{'is-invalid': $v.entity.qtdePessoas.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.qtdePessoas.minValue || !$v.entity.qtdePessoas.maxValue">
                    Quantidade deve estar entre 1 e 70 Pessoas
                </div>
            </div>

            <div class="col-3">
                <label>Data da Reserva</label><span class="isRequired"> *</span>
                <input id="dtReserva" type="date" class="form-control" v-uppercase v-model.lazy="entity.dtReserva"
                    :class="{'is-invalid': $v.entity.dtReserva.$error || dtInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtReserva.required">
                    Data da Reserva obrigatória
                </div>
                <div class="invalid-feedback" v-if="dtInvalid">
                    Data da Reserva deve ter no mínimo 3 dias de antecedência
                </div>
            </div>

            <div class="col-2">
                <label>Valor</label>
                <money id="valor" class="form-control text-right" v-model="entity.valor" v-model.number="entity.valor" disabled
                    v-bind="money"></money>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>Cliente</label><span class="isRequired"> *</span>
                <div class="input-group">
                   <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="searchCliente"
                        :class="{'is-invalid': $v.entity.codigoCliente.$error}"/>
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
                <label>Condição de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                   <input id="codigoCondicaoPagamento" type="number" class="form-control" v-model.number="entity.codigoCondicaoPagamento" @input="searchCondicao"
                        :class="{'is-invalid': $v.entity.codigoCondicaoPagamento.$error}"/>
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

        <div class="row mt-3">
            <div class="col-4">
                <label>Áreas de Locação</label>
            </div>
            
            <div class="col-4">
                <small v-if="entity.areasLocacao.length == '0'" class="invalid">Selecione pelo menos uma área para locação</small>
            </div>
        </div>
        <div class="row">
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
                </vue-good-table>
            </div>
        </div>

        <div class="row form-group align-items-end mt-5">
            <div class="col-2">
                <label>Data de Cadastro</label>
                <input id="dataCadastro" type="text" class="form-control" v-model="dtCad" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Alteração</label>
                <input id="dataAlteracao" type="text" class="form-control" v-model="dtAlt" readonly/>
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
import {Money} from 'v-money'
import Helper from '@/components/helper'
import {ClientesService} from '@/services/clientes.service'
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import {AreasLocacaoService} from '@/services/areasLocacao.service'
import {PrecificacoesService} from '@/services/precificacoes.service'
import {ReservasService} from '@/services/reservas.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import ConsultaCondicaoPagamento from '@/components/pages/condicoesPagamento/Consult.vue'
import {VueGoodTable} from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ReservasEdit",
    components: { Money, VueGoodTable, ConsultaCliente, ConsultaCondicaoPagamento },
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
            dtCad: null,
            dtAlt: null,
            dtInvalid: false,
            money: {
                decimal: ',',
                thousands: '.',
                prefix: 'R$ ',
                suffix: '',
                precision: 2,
                masked: false
            },
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
                        field: "valorAux",
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

            for (let i = 0; i < vm.areasLocacao.rows.length; i++) {
                vm.areasLocacao.rows[i].valorAux = Helper.number_format(vm.areasLocacao.rows[i].valor);
            }

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
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
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
            this.isLoading = true;
            var vm = this;
            if (vm.entity.codigoCliente > 0) {
                ClientesService.getById(vm.entity.codigoCliente).then(function (response) {
                    vm.clienteSelecionado = response.data.nome;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCliente = 0;
                    vm.clienteSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Cliente não encontrada");
                });
            } else {
                vm.clienteSelecionado = null;
                vm.isLoading = false;
            }
        },
        searchCondicao() {
            this.isLoading = true;
            var vm = this;
            if (vm.entity.codigoCondicaoPagamento > 0) {
                CondicoesPagamentoService.getById(vm.entity.codigoCondicaoPagamento).then(function (response) {
                    vm.condicaoSelecionada = response.data.descricao;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCondicaoPagamento = 0;
                    vm.condicaoSelecionada = null;
                    vm.isLoading = false;
                    notyf.error("Condição de Pagamento não encontrada");
                });
            } else {
                vm.condicaoSelecionada = null;
                vm.isLoading = false;
            }
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.$v.$touch();
            const vm = this;

            if (vm.$v.$invalid) {
                vm.isSubmiting = false;
                return;
            }

            var dateNow = Date.now();
            dateNow = Helper.addDays(dateNow, 3);
            dateNow = Helper.dateToDateString(dateNow);
            if (vm.entity.dtReserva < dateNow) {
                vm.dtInvalid = true;
                document.getElementById('dtReserva').focus();
                vm.isSubmiting = false;
                return;
            }

            if (vm.entity.areasLocacao.length == 0) {
                notyf.error("Selecione pelo menos uma área para locação");
                vm.isSubmiting = false;
                return;
            }

            ReservasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editada" : 'criada';
                notyf.success("Reserva " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/reservas');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
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
            if (!this.isCreate) {
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