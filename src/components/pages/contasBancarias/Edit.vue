<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Conta Bancaria</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Instituição</label><span class="isRequired"> *</span>
                <input id="instituicao" type="text" class="form-control" v-uppercase v-model.lazy="entity.instituicao"
                    :class="{'is-invalid': $v.entity.instituicao.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.instituicao.required">
                    Instituição obrigatória
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.instituicao.maxLength">
                    Instituição deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-3">
                <label>Número do Banco</label><span class="isRequired"> *</span>
                <the-mask id="numeroBanco" class="form-control" v-model="entity.numeroBanco"
                    mask="###" :class="{'is-invalid': $v.entity.numeroBanco.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.numeroBanco.required">
                    Número do Banco obrigatória
                </div>
            </div>

            <div class="col-2">
                <label>Agência</label><span class="isRequired"> *</span>
                <the-mask id="agencia" class="form-control" v-model="entity.agencia"
                    :mask="['###', '###-#', '###-##']" :masked="true"
                    :class="{'is-invalid': $v.entity.agencia.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.agencia.required">
                    Agência obrigatória
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.agencia.minValue || !$v.entity.agencia.maxValue">
                    Agência tem de 3 a 6 digitos
                </div>
            </div>

            <div class="col-2">
                <label>Conta</label><span class="isRequired"> *</span>
                <the-mask id="conta" class="form-control" v-model="entity.conta"
                    :mask="['###-#', '####-#', '#####-#', '######-#']" :masked="true"
                    :class="{'is-invalid': $v.entity.conta.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.conta.required">
                    Conta obrigatória
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.conta.minLength || !$v.entity.conta.maxLength">
                    Conta deve ter entre 5 e 8 digitos
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Saldo</label>
                <money id="saldo" class="form-control text-right" v-model="entity.saldo"
                    v-bind="money" :class="{'is-invalid': $v.entity.saldo.$error}"></money>
                <div class="invalid-feedback" v-if="!$v.entity.saldo.minValue || !$v.entity.saldo.maxValue">
                    Valor deve ser entre 0,01 e 99.999.999,99
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
                    <router-link v-if="!isModal" :to="{name: 'ContasBancariasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, minValue, maxValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import {Money} from 'v-money'
import {ContasBancariasService} from '@/services/contasBancarias.service'
import Helper from '@/components/helper'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ContasBancariasEdit",
    components: { TheMask, Money },
    props: {
        isModal: {
            type: Boolean,
            default: false
        },
        editContaBancaria: {
            type: Object,
            default: null
        }
    },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                instituicao: {
                    required,
                    maxLength: maxLength(50),
                },
                numeroBanco: {
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(3),
                },
                agencia: {
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(6),
                },
                conta: {
                    required,
                    minLength: minLength(5),
                    maxLength: maxLength(8),
                },
                saldo: {
                    minValue: minValue(0.01),
                    maxValue: maxValue(99999999.99),
                }
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                instituicao: null,
                numeroBanco: null,
                agencia: null,
                conta: null,
                saldo: 0,
                codigoEmpresa: 0,
                dtCadastro: null,
                dtAlteracap: null,
            },
            dtCad: null,
            dtAlt: null,
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
        if (this.isModal) {
            if (this.editContaBancaria != null) {
                this.entity = this.editContaBancaria;

                var dateTimeCad = Helper.serverDateToDateTimeString(this.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(this.entity.dtAlteracao);

                this.entity.dtCadastro = dateTimeCad.date + " " + dateTimeCad.hour;
                this.entity.dtAlteracao = dateTimeAlt.date + " " + dateTimeAlt.hour;
            }
        } else {
            const vm = this;
            if (this.$route.params.codigo) {
                this.entity.codigo = this.$route.params.codigo;

                ContasBancariasService.getById(this.entity.codigo).then(function (response) {
                    vm.entity = response.data;

                    var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                    var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                    vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                    vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                });
            }
        }
    },
    methods: {
        save() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }
            
            if (this.isModal) {
                this.$emit('emit-contaBancaria', this.entity);
            } else {
                if (this.isSubmiting || this.isLoading) return;
                this.isSubmiting = true;
                const vm = this;

                ContasBancariasService.save(this.entity).then(function () {
                    const msg = vm.entity.codigo ? "editado" : 'criado';
                    notyf.success("Conta Bancaria " + msg + " com sucesso");
                    vm.isSubmiting = false;
                    vm.$router.push('/app/contasBancarias');
                }).catch(function (errors){
                    notyf.error(errors.response.data.message);
                    vm.isSubmiting = false;
                });
            }
        }
    }
}
</script>