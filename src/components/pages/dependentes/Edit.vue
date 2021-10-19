<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Dependentes</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Dependente</label><span class="isRequired"> *</span>
                <input id="dependente" type="text" class="form-control" v-uppercase v-model.lazy="entity.nome"
                    :class="{'is-invalid': $v.entity.nome.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.nome.required">
                    Dependente obrigatória
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.nome.maxLength">
                    Dependente deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Masculino" v-uppercase v-model.lazy="entity.sexo"> Masculino</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Feminino" v-uppercase v-model.lazy="entity.sexo"> Feminino</label>
            </div>

            <div v-if="!isModal" class="col-5">
                <label>Sócio</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCliente" type="number" class="form-control" v-model.number="entity.codigoCliente" @input="onSearchCliente"
                        :class="{'is-invalid': $v.entity.codigoCliente.$error}"/>
                    <div class="input-group-append">
                        <input id="cliente" type="text" class="form-control" v-model.lazy="socioSelecionado" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCliente.minValue">
                        Selecione um Sócio
                    </div>
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-4">
                <label>Logradouro</label><span class="isRequired"> *</span>
                <input id="logradouro" type="text" class="form-control" v-uppercase v-model.lazy="entity.logradouro"
                    :class="{'is-invalid': $v.entity.logradouro.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.logradouro.required">
                    Logradouro obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.logradouro.maxLength">
                    Logradouro deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>Complemento</label>
                <input id="complemento" type="text" class="form-control" v-uppercase v-model.lazy="entity.complemento"/>
            </div>

            <div class="col-4">
                <label>Bairro</label><span class="isRequired"> *</span>
                <input id="bairro" type="text" class="form-control" v-uppercase v-model.lazy="entity.bairro"
                    :class="{'is-invalid': $v.entity.bairro.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.bairro.required">
                    Bairro obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.bairro.maxLength">
                    Bairro deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>CEP</label><span class="isRequired"> *</span>
                <the-mask id="cep" class="form-control" v-model="entity.cep"
                    mask="#####-###" :masked="true"
                    :class="{'is-invalid': $v.entity.cep.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.cep.required">
                    CEP obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.cep.minLength || !$v.entity.cep.maxLength">
                    CEP inválido
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>Cidade</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCidade" type="number" class="form-control" v-model.number="entity.codigoCidade" @input="onSearchCidade"
                        :class="{'is-invalid': $v.entity.codigoCidade.$error}"/>
                    <div class="input-group-append">
                        <input id="cidade" type="text" class="form-control" v-uppercase v-model.lazy="cidadeSelecionada" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-cidade class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCidade.minValue">
                        Selecione uma Cidade
                    </div>
                </div>
            </div>

            <div class="col-3">
                <label>Telefone</label><span class="isRequired"> *</span>
                <the-mask id="telefone" class="form-control" v-model="entity.telefone"
                    :mask="['(##) ####-####', '(##) #####-####']" :masked="true"
                    :class="{'is-invalid': $v.entity.telefone.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.telefone.required">
                    Telefone obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.telefone.minLength || !$v.entity.telefone.maxLength">
                    Telefone inválido
                </div>
            </div>

            <div class="col-4">
                <label>Email</label><span class="isRequired"> *</span>
                <input id="email" type="text" class="form-control" v-uppercase v-model.lazy="entity.email"
                    :class="{'is-invalid': $v.entity.email.$error || emailInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.email.required">
                    Email obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.email.maxLength">
                    Email deve ter no máximo 50 caracteres
                </div>
                <div class="invalid-feedback" v-if="emailInvalid">
                    Email inválido
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-3">
                <label>CPF</label><span class="isRequired"> *</span>
                <the-mask id="cpf" class="form-control" v-model="entity.cpf"
                    mask="###.###.###-##" :masked="false"
                    :class="{'is-invalid': $v.entity.cpf.$error || cpfInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.cpf.required">
                    CPF obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.cpf.minLength || !$v.entity.cpf.maxLength || cpfInvalid">
                    CPF inválido
                </div>
            </div>

            <div class="col-3">
                <label>RG</label>
                <input id="rg" type="text" class="form-control" v-uppercase v-model.lazy="entity.rg"/>
            </div>

            <div class="col-3">
                <label>Data de Nascimento</label><span class="isRequired"> *</span>
                <input id="dtNascimento" type="date" class="form-control" v-model="entity.dtNascimento"
                    :class="{'is-invalid': $v.entity.dtNascimento.$error || dtInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtNascimento.required">
                    Data de Nascimento obrigatória
                </div>
                <div class="invalid-feedback" v-if="dtInvalid">
                    Idade mínima de 1 anos
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
                    <router-link v-if="!isModal" :to="{name: 'DependentesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal v-if="!isModal" id="modal-consult-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" :isModal="true"/>
        </b-modal>
        
        <b-modal id="modal-consult-cidade-dependente" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, minValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import Helper from '@/components/helper'
import {ClientesService} from '@/services/clientes.service'
import {CidadesService} from '@/services/cidades.service'
import {DependentesService} from '@/services/dependentes.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "DependentesEdit",
    components: { TheMask, ConsultaCidade, ConsultaCliente },
    props: {
        isModal: {
            type: Boolean,
            default: false
        },
        editDependente: {
            type: Object,
            default: null
        }
    },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                nome:  {
                    required,
                    maxLength: maxLength(50),
                },
                logradouro: {
                    required,
                    maxLength: maxLength(50),
                },
                bairro: {
                    required,
                    maxLength: maxLength(50),
                },
                cep: {
                    required,
                    minLength: minLength(9),
                    maxLength: maxLength(9),
                },
                codigoCidade: {
                    minValue: minValue(1),
                },
                telefone: {
                    required,
                    minLength: minLength(14),
                    maxLength: maxLength(15),
                },
                email: {
                    required,
                    maxLength: maxLength(50),
                },
                cpf: {
                    required,
                    minLength: minLength(11),
                    maxLength: maxLength(11),
                },
                dtNascimento: {
                    required,
                },
                codigoCliente: this.isModal ? {} : { minValue: minValue(1) }
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                nome: null,
                sexo: "Masculino",
                logradouro: null,
                complemento: null,
                bairro: null,
                cep: null,
                codigoCidade: 0,
                telefone: null,
                email: null,
                cpf: null,
                rg: null,
                dtNascimento: null,
                codigoCliente: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
            socioSelecionado: null,
            cidadeSelecionada: null,
            dtCad: null,
            dtAlt: null,
            emailInvalid: false,
            cpfInvalid: false,
            dtInvalid: false,
            isLoading: false,
            isSubmiting: false
        }
    },
    created() {
        if (this.isModal) {
            if (this.editDependente != null) {
                this.entity = this.editDependente;
                
                var dateNascimento = Helper.dateToDateString(this.entity.dtNascimento);
                var dateTimeCad = Helper.serverDateToDateTimeString(this.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(this.entity.dtAlteracao);

                this.entity.dtNascimento = dateNascimento;
                this.entity.dtCadastro = dateTimeCad.date + " " + dateTimeCad.hour;
                this.entity.dtAlteracao = dateTimeAlt.date + " " + dateTimeAlt.hour;
                this.cidadeSelecionada = this.entity.cidade.cidade;
            }
        } else {
            const vm = this;
            if (this.$route.params.codigo) {
                this.entity.codigo = this.$route.params.codigo;

                DependentesService.getById(this.entity.codigo).then(function (response) {
                    vm.entity = response.data;
                    
                    var dateNascimento = Helper.dateToDateString(vm.entity.dtNascimento);
                    var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                    var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                    vm.entity.dtNascimento = dateNascimento;
                    vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                    vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                    vm.socioSelecionado = response.data.cliente.nome;
                    vm.cidadeSelecionada = response.data.cidade.cidade;
                });
            }
        }
    },
    methods: {
        selectCliente(entity) {
            this.socioSelecionado = entity.nome;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consult-cliente");
        },
        onSearchCliente() {
            this.searchCliente(this);
        },
        searchCliente: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoCliente > 0) {
                ClientesService.getSocioById(vm.entity.codigoCliente).then(function (response) {
                    vm.socioSelecionado = response.data.nome;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCliente = 0;
                    vm.socioSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Socio não encontrado");
                });
            } else {
                vm.socioSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        selectCidade(entity) {
            this.cidadeSelecionada = entity.cidade;
            this.entity.codigoCidade = entity.codigo;
            this.$bvModal.hide("modal-new-cidade");
            this.$bvModal.hide("modal-consult-cidade-dependente");
        },
        onSearchCidade() {
            this.searchCidade(this);
        },
        searchCidade: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoCidade > 0) {
                CidadesService.getById(vm.entity.codigoCidade).then(function (response) {
                    vm.cidadeSelecionada = response.data.cidade;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCidade = 0;
                    vm.cidadeSelecionada = null;
                    vm.isLoading = false;
                    notyf.error("Cidade não encontrada");
                });
            } else {
                vm.cidadeSelecionada = null;
                vm.isLoading = false;
            }
        }, 350),
        save() {
            this.emailInvalid = false;
            this.cpfInvalid = false;
            this.dtInvalid = false;
            this.$v.$touch();
            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }
            
            if (!Helper.validadorCPF(this.entity.cpf)) {
                this.cpfInvalid = true;
                document.getElementById('cpf').focus();
                this.isSubmiting = false;
                return;
            }

            if (Helper.calculaIdade(this.entity.dtNascimento) < 1) {
                this.dtInvalid = true;
                document.getElementById('dtNascimento').focus();
                this.isSubmiting = false;
                return;
            }
            
            if (this.isModal) {
                this.$emit('emit-dependente', this.entity);
            } else {
                if (this.isSubmiting || this.isLoading) return;
                this.isSubmiting = true;
                const vm = this;

                DependentesService.save(this.entity).then(function () {
                    const msg = vm.entity.codigo ? "editado" : "criado";
                    notyf.success("Dependente " + msg + " com sucesso");
                    vm.isSubmiting = false;
                    vm.$router.push('/app/dependentes');
                }).catch(function (errors){
                    notyf.error(errors.response.data.message);
                    vm.isSubmiting = false;
                });
            }
        }
    }
}
</script>

<style scoped>
    .labelRadio {
        display: inline-block;
        margin-bottom: 0 !important;
    }
</style>