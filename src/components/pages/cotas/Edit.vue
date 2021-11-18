<template>
    <div class="col-12">
        <h2>Cadastro de Cota</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Cota</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Cliente</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="onSearchCliente"
                        :class="{'is-invalid': $v.entity.codigoCliente.$error}" :disabled="isEdit"/>
                    <div class="input-group-append">
                        <input id="cliente" type="text" class="form-control" v-uppercase v-model.lazy="clienteSelecionado" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1" :disabled="isEdit">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCliente.minValue">
                        Selecione um Cliente
                    </div>
                </div>
            </div>

            <div class="col-2 form-group">
                <label>Valor</label><span class="isRequired"> *</span>
                <money id="valor" class="form-control text-right" v-model="entity.valor" v-bind="money" @input="onValue" :disabled="isEdit"
                    :class="{'is-invalid': $v.entity.valor.$error}"></money>
                <div class="invalid-feedback" v-if="!$v.entity.valor.required">
                    Valor obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.valor.minValue || !$v.entity.valor.maxValue">
                    Valor deve ser entre 0,01 e 99.999.999,99
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Data de Início</label>
                <input id="dtInicio" type="date" class="form-control" v-model="entity.dtInicio" readonly/>
            </div>

            <div class="col-2">
                <label>Data de Término</label>
                <input id="dtTermino" type="date" class="form-control" v-model="entity.dtTermino" readonly/>
            </div>
        </div>

        <div v-if="parcelas.rows.length > 0" class="row mt-4">
            <div class="col-12">
                <label>Parcelas</label>
            </div>
        </div>

        <div v-if="parcelas.rows.length > 0" class="row">
            <div class="col-12">
                <vue-good-table compactMode
                    :columns="parcelas.columns"
                    :rows="parcelas.rows"
                    :search-options="{enabled: false}"
                    :pagination-options="{perPage: 12, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
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
                    <router-link :to="{name: 'CotasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input v-if="!isEdit" type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                    <input v-if="isEdit" type="submit" value="Cancelar" class="btn btn-primary" @click.prevent="cancel()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" :isModal="true" :isCota="true" />
        </b-modal>
    </div>
</template>

<script>
import {CotasService} from '@/services/cotas.service'
import {ClientesService} from '@/services/clientes.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import {validationMixin} from 'vuelidate'
import {required, minValue, maxValue} from 'vuelidate/lib/validators'
import {Money} from 'v-money'
import Helper from '@/components/helper'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "CotasEdit",
    components: { Money, ConsultaCliente, VueGoodTable },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                codigoCliente: {
                    minValue: minValue(1),
                },
                valor: {
                    required,
                    minValue: minValue(0.01),
                    maxValue: maxValue(99999999.99)
                },
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                codigoCliente: 0,
                valor: 0,
                dtInicio: null,
                dtTermino: null,
                parcelas: [],
                dtCadastro: null,
                dtAlteracao: null
            },
            clienteSelecionado: null,
            dtCad: null,
            dtAlt: null,
            dtInicioInvalid: false,
            dtTerminoInvalid: false,
            parcelas: {
                columns: [
                    {
                        label: "Parcela",
                        field: "numeroParcela",
                        type: "number",
                        width: "120px",
                    },
                    {
                        label: "Valor",
                        field: "valorApresentavel",
                        type: "number",
                        width: "150px",
                    },
                    {
                        label: "Data de Vencimento",
                        field: "dtVencimento",
                        type: "date",
                        dateInputFormat: 'yyyy-MM-dd',
                        dateOutputFormat: 'dd/MM/yyyy',
                        width: "200px",
                    },
                    {
                        label: "Forma de Pagamento",
                        field: "formaPagamento.descricao"
                    },
                    {
                        label: "Status",
                        field: "status",
                        width: "120px"
                    }
                ],
                rows: [],
                totalRecords: 0
            },
            money: {
                decimal: ',',
                thousands: '.',
                prefix: 'R$ ',
                suffix: '',
                precision: 2,
                masked: false
            },
            isLoading: false,
            isSubmiting: false,
            isEdit: false,
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.isEdit = true;
            this.entity.codigo = this.$route.params.codigo;

            CotasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                var dateInicio = Helper.dateToDateString(vm.entity.dtInicio);
                var dateTermino = Helper.dateToDateString(vm.entity.dtTermino);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                vm.entity.dtInicio = dateInicio;
                vm.entity.dtTermino = dateTermino;
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.clienteSelecionado = vm.entity.cliente.nome;

                vm.parcelas.rows = vm.entity.parcelas;
                vm.parcelas.totalRecords = vm.entity.parcelas.length;

                for (let i = 0; i < vm.parcelas.totalRecords; i++) {
                    vm.parcelas.rows[i].dtVencimento = Helper.dateToDateString(vm.parcelas.rows[i].dtVencimento);
                    vm.parcelas.rows[i].valorApresentavel = Helper.number_format(vm.parcelas.rows[i].valorParcela);
                }
            });
        } else {
            let ano = new Date().getYear();
            let bissexto = (ano % 4 == 0 &&  ano % 100 != 0 ||  ano % 400 == 0);

            vm.entity.dtInicio = Helper.dateToDateString(new Date());
            vm.entity.dtTermino = Helper.dateToDateString(Helper.addDays(vm.entity.dtInicio, bissexto ? 366 : 365));
        }
    },
    methods: {
        selectCliente(entity) {
            this.clienteSelecionado = entity.nome;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consult-cliente");
        },
        onSearchCliente() {
            if (this.entity.codigoCliente == "" || this.entity.codigoCliente == null) {
                this.entity.codigoCliente = 0;
                this.clienteSelecionado = null;
            }
            this.searchCliente(this);
        },
        searchCliente: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoCliente > 0) {
                ClientesService.getById(vm.entity.codigoCliente).then(function (response) {
                    vm.clienteSelecionado = response.data.nome;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCliente = 0;
                    vm.clienteSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Cliente não encontrado");
                });
            } else {
                vm.clienteSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        onValue() {
            if (!this.isEdit && this.entity.valor > 0) {
                this.gerarParcelas(this);
            }
        },
        gerarParcelas: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.valor > 0) {
                var params = {
                    codigoCondicaoPagamento: 1,
                    dtEmissao: new Date(),
                    valorTotal: vm.entity.valor
                };

                CotasService.gerarParcelas(params).then(function (response) {
                    vm.parcelas.totalRecords = response.data.length;
                    vm.parcelas.rows = response.data;
                    
                    for (let i = 0; i < vm.parcelas.totalRecords; i++) {
                        var dateVencimento = Helper.dateToDateString(vm.parcelas.rows[i].dtVencimento);
                        
                        vm.parcelas.rows[i].dtVencimento = dateVencimento;
                        vm.parcelas.rows[i].valorApresentavel = Helper.number_format(vm.parcelas.rows[i].valorParcela);
                    }
                    
                    vm.isLoading = false;
                });
            }
        }, 500),
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.$v.$touch();

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }

            const vm = this;

            this.entity.parcelas = this.parcelas.rows;
            CotasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : "criado";
                notyf.success("Cota " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/cotas');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        },
        cancel() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            const vm = this;

            CotasService.delete(this.entity.codigo).then(function () {
                notyf.success("Cota cancelada com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/cotas');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>