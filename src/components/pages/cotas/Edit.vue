<template>
    <div class="col-12">
        <h2>Cadastro de Cota</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Cota</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Cliente</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="searchCliente"
                        :class="{'is-invalid': $v.entity.codigoCliente.$error}"/>
                    <div class="input-group-append">
                        <input id="cliente" type="text" class="form-control" v-uppercase v-model.lazy="clienteSelecionado" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCliente.minValue">
                        Selecione um Cliente
                    </div>
                </div>
            </div>

            <div class="col-2 form-group">
                <label>Valor</label><span class="isRequired"> *</span>
                <money id="valor" class="form-control text-right" v-model="entity.valor"
                    v-bind="money"
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
            <div class="col-3">
                <label>Data de Início</label><span class="isRequired"> *</span>
                <input id="dtInicio" type="date" class="form-control" v-model="entity.dtInicio"
                    :class="{'is-invalid': $v.entity.dtInicio.$error || dtInicioInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtInicio.required">
                    Data de Início obrigatória
                </div>
                <div class="invalid-feedback" v-if="dtInicioInvalid">
                    Data de Início deve ser no minimo o dia de hoje
                </div>
            </div>

            <div class="col-3">
                <label>Data de Término</label><span class="isRequired"> *</span>
                <input id="dtTermino" type="date" class="form-control" v-model="entity.dtTermino"
                    :class="{'is-invalid': $v.entity.dtTermino.$error || dtTerminoInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtTermino.required">
                    Data de Término obrigatória
                </div>
                <div class="invalid-feedback" v-if="!dtTerminoInvalid">
                    Data de Término deve ser maior que a data de inicio
                </div>
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
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" :isCota="true" />
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minValue, maxValue} from 'vuelidate/lib/validators'
import {Money} from 'v-money'
import {ClientesService} from '@/services/clientes.service'
import {CotasService} from '@/services/cotas.service'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import Helper from '@/components/helper'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "CotasEdit",
    components: { Money, ConsultaCliente },
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
                dtInicio: {
                    required,
                },
                dtTermino: {
                    required,
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
                dtCadastro: null,
                dtAlteracao: null
            },
            clienteSelecionado: null,
            dtCad: null,
            dtAlt: null,
            dtInicioInvalid: false,
            dtTerminoInvalid: false,
            money: {
                decimal: ',',
                thousands: '.',
                prefix: 'R$ ',
                suffix: '',
                precision: 2,
                masked: false
            },
            isLoading: false,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
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
            });
        }
    },
    methods: {
        selectCliente(entity) {
            this.clienteSelecionado = entity.nome;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consult-cliente");
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
                    notyf.error("Cliente não encontrado");
                });
            } else {
                vm.clienteSelecionado = null;
                vm.isLoading = false;
            }
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.$v.$touch();
            const vm = this;

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }
            
            var dateNow = Date.now();
            dateNow = Helper.dateToDateString(dateNow);
            if (vm.entity.dtInicio < dateNow) {
                vm.dtInicioInvalid = true;
                document.getElementById('dtInicio').focus();
                vm.isSubmiting = false;
                return;
            }

            if (vm.entity.dtInicio >= vm.entity.dtTermino) {
                vm.dtTerminoInvalid = true;
                document.getElementById('dtTermino').focus();
                vm.isSubmiting = false;
                return;
            }

            CotasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Cota " + msg + " com sucesso");
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