<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Fornecedor</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-2">
                <label>Tipo Pessoa</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="PF" v-uppercase v-model.lazy="entity.tipoPessoa" :disabled="entity.codigo > 0"> Pessoa Física</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="PJ" v-uppercase v-model.lazy="entity.tipoPessoa" :disabled="entity.codigo > 0"> Pessoa Jurídica</label>
            </div>

            <div class="col-5">
                <label>Fornercedor</label><span class="isRequired"> *</span>
                <input id="nome" type="text" class="form-control" v-uppercase v-model.lazy="entity.nome"
                    :class="{'is-invalid': $v.entity.nome.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.nome.required">
                    Fornercedor obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.nome.maxLength">
                    Fornercedor deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Masculino" v-model="entity.sexo"> Masculino</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Feminino" v-model="entity.sexo"> Feminino</label>
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
                <label>{{ labels.cpfCnpj }}</label><span class="isRequired"> *</span>
                <the-mask id="cpfCnpj" class="form-control" v-model="entity.cpfCnpj"
                    :mask="['###.###.###-##', '##.###.###/####-##']" :masked="false"
                    :class="{'is-invalid': $v.entity.cpfCnpj.$error || cpfCnpjInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.cpfCnpj.required">
                    {{ labels.cpfCnpj }} obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.cpfCnpj.minLength || !$v.entity.cpfCnpj.maxLength || cpfCnpjInvalid">
                    {{ labels.cpfCnpj }} inválido
                </div>
            </div>

            <div class="col-3">
                <label>{{ labels.rgIe }}</label>
                <input id="rgIe" type="text" class="form-control" v-uppercase v-model.lazy="entity.rgIe"/>
            </div>

            <div class="col-3">
                <label>{{ labels.dtNascFundacao }}</label><span class="isRequired"> *</span>
                <input id="dtNascimento" type="date" class="form-control" v-model="entity.dtNascimento"
                    :class="{'is-invalid': $v.entity.dtNascimento.$error || dtInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtNascimento.required">
                    {{ labels.dtNascimento }} obrigatória
                </div>
                <div class="invalid-feedback" v-if="dtInvalid">
                    {{ dtError }}
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
                    <router-link v-if="!isModal" :to="{name: 'FornecedoresList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consult-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, minValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import Helper from '@/components/helper'
import {CidadesService} from '@/services/cidades.service'
import {FornecedoresService} from '@/services/fornecedores.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "FornecedoresEdit",
    components: { TheMask, ConsultaCidade },
    props: {
        isModal: {
            type: Boolean,
            default: false
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
                cpfCnpj: {
                    required,
                    minLength: minLength(11),
                    maxLength: maxLength(14),
                },
                dtNascimento: {
                    required,
                },
            }
        }
        return validation;
    },
    data() {
        return {
            labels: { cpfCnpj: "CPF", rgIe: "RG", dtNascFundacao: "Data de Nascimento" },
            entity: {
                codigo: 0,
                nome: null,
                tipoPessoa: "PF",
                cpfCnpj: null,
                rgIe: null,
                sexo: "Masculino",
                telefone: null,
                email: null,
                dtNascimento: null,
                codigoCidade: 0,
                logradouro: null,
                complemento: null,
                bairro: null,
                cep: null,
                dtCadastro: null,
                dtAlteracao: null
            },
            cidadeSelecionada: null,
            dtCad: null,
            dtAlt: null,
            emailInvalid: false,
            cpfCnpjInvalid: false,
            dtInvalid: false,
            dtError: null,
            isLoading: false,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
            
            FornecedoresService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateAniversario = Helper.dateToDateString(vm.entity.dtNascimento);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);
                
                vm.entity.dtNascimento = dateAniversario;
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.cidadeSelecionada = response.data.cidade.cidade;
            });
        }
    },
    watch: {
        'entity.tipoPessoa'(value) {
            if (value == "PF") {
                this.labels = { cpfCnpj: "CPF", rgIe: "RG", dtNascFundacao: "Data de Nascimento" };
            } else {
                this.labels = { cpfCnpj: "CNPJ", rgIe: "Inscrição Estadual", dtNascFundacao: "Data de Fundação" };
            }
        }
    },
    methods: {
        selectCidade(entity) {
            this.cidadeSelecionada = entity.cidade;
            this.entity.codigoCidade = entity.codigo;
            this.$bvModal.hide("modal-new-cidade");
            this.$bvModal.hide("modal-consult-cidade");
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
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.emailInvalid = false;
            this.cpfCnpjInvalid = false;
            this.dtInvalid = false;
            this.$v.$touch();
            const vm = this;

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }
            
            if (!Helper.validadorEmail(this.entity.email)) {
                vm.emailInvalid = true;
                document.getElementById('email').focus();
                vm.isSubmiting = false;
                return;
            }
            
            if (this.entity.tipoPessoa == "PF") {
                if(!Helper.validadorCPF(this.entity.cpfCnpj)) {
                    vm.cpfCnpjInvalid = true;
                    document.getElementById('cpfCnpj').focus();
                    vm.isSubmiting = false;
                    return;
                }
                
                if (Helper.calculaIdade(vm.entity.dtNascimento) < 18) {
                    vm.dtInvalid = true;
                    vm.dtError = "Idade deve ser no mínimo 18 anos";
                    document.getElementById('dtNascimento').focus();
                    vm.isSubmiting = false;
                    return;
                }
            } else {
                if (!Helper.validadorCNPJ(this.entity.cpfCnpj)) {
                    vm.cpfCnpjInvalid = true;
                    document.getElementById('cpfCnpj').focus();
                    vm.isSubmiting = false;
                    return;
                }

                var dateNow = Date.now();
                dateNow = Helper.dateToDateString(dateNow);
                if (vm.entity.dtFundacao > dateNow) {
                    vm.dtInvalid = true;
                    vm.dtError = vm.labels.dtdtNascFundacao + " deve ser no máximo a data de hoje";
                    document.getElementById('dtNascimento').focus();
                    vm.isSubmiting = false;
                    return;
                }
            }
            
            FornecedoresService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : "criado";
                notyf.success("Fornecedor " + msg + " com sucesso");
                vm.isSubmiting = false;
                
                if(!vm.isModal){
                    vm.$router.push('/app/fornecedores');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-fornecedor', vm.entity);
                }
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
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