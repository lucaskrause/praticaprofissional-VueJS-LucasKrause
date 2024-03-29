<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Área de Locação</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Área de Locação</label><span class="isRequired"> *</span>
                <input id="descricao" type="text" class="form-control" v-uppercase v-model.lazy="entity.descricao"
                    :class="{'is-invalid': $v.entity.descricao.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.descricao.required">
                    Área de Locação obrigatória
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.descricao.maxLength">
                    Área de Locação deve ter no máximo 50 caracteres
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
                    <router-link v-if="!isModal" :to="{name: 'AreasLocacaoList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, maxLength, minValue, maxValue} from 'vuelidate/lib/validators'
import {Money} from 'v-money'
import Helper from '@/components/helper'
import {AreasLocacaoService} from '@/services/areasLocacao.service'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "AreasLocacaoEdit",
    components: { Money },
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
                descricao: {
                    required,
                    maxLength: maxLength(50)
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
                descricao: null,
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
        
            AreasLocacaoService.getById(this.entity.codigo).then(function (response) {
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

            AreasLocacaoService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editada" : "criada";
                notyf.success("Área " + msg + " com sucesso");
                vm.isSubmiting = false;
                
                if(!vm.isModal){
                    vm.$router.push('/app/areaLocacao');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-area', vm.entity);
                }
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>