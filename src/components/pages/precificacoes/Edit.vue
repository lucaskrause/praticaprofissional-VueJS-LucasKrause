<template>
    <div class="col-12">
        <h2>Cadastro de Preço</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-2">
                <label>Mín de Pessoas</label><span class="isRequired"> *</span>
                <the-mask id="minPessoas" class="form-control" v-model.number="entity.minPessoas"
                    mask="##" :masked="true"
                    :class="{'is-invalid': $v.entity.minPessoas.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.minPessoas.required">
                    Mín de Pessoas obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.minPessoas.minValue || !$v.entity.minPessoas.maxValue">
                    Mín de Pessoas deve estar entre 1 e 70
                </div>
            </div>

            <div class="col-2">
                <label>Máx de Pessoas</label><span class="isRequired"> *</span>
                <the-mask id="maxPessoas" class="form-control" v-model.number="entity.maxPessoas"
                    mask="##" :masked="true"
                    :class="{'is-invalid': $v.entity.maxPessoas.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.maxPessoas.required">
                    Máx de Pessoas obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.maxPessoas.minValue || !$v.entity.maxPessoas.maxValue">
                    Máx de Pessoas deve estar entre {{ entity.minPessoas }} e 70
                </div>
            </div>

            <div class="col-2">
                <label>Valor</label><span class="isRequired"> *</span>
                <money id="valor" class="form-control text-right" v-model="entity.valor"
                    v-bind="money"
                    :class="{'is-invalid': $v.entity.valor.$error}"></money>
                <div class="invalid-feedback" v-if="!$v.entity.valor.required">
                    Valor obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.valor.minValue || !$v.entity.valor.maxValue">
                    Valor deve ser entre 0.01 e 99,999,999.99
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
                    <router-link :to="{name: 'PrecificacoesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minValue, maxValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import {Money} from 'v-money'
import Helper from '@/components/helper'
import {PrecificacoesService} from '@/services/precificacoes.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "PrecificacoesEdit",
    components: { TheMask, Money },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                minPessoas: {
                    required,
                    minValue: minValue(1),
                    maxValue: maxValue(70),
                },
                maxPessoas: {
                    required,
                    minValue: minValue(this.entity.minPessoas),
                    maxValue: maxValue(70),
                },
                valor: {
                    required,
                    minValue: minValue(0.01),
                    maxValue: maxValue(99999999.99),
                },
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                minPessoas: 0,
                maxPessoas: 0,
                valor: 0,
                dtCadastro: null,
                dtAlteracao: null
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
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;

            PrecificacoesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);
                
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
            });
        }
    },
    methods: {
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.$v.$touch();
            const vm = this;

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }

            PrecificacoesService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Preço " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/precificacoes');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>