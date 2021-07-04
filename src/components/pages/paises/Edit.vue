<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de País</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>País</label><span class="isRequired"> *</span>
                <input id="pais" type="text" class="form-control" v-uppercase v-model.lazy="entity.pais"
                    :class="{'is-invalid': $v.entity.pais.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.pais.required">
                    País obrigatório
                </div>
            </div>

            <div class="col-2">
                <label>Sigla</label><span class="isRequired"> *</span>
                <input id="sigla" type="text" class="form-control" v-uppercase v-model.lazy="entity.sigla"
                    :class="{'is-invalid': $v.entity.sigla.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.sigla.required">
                    Sigla obrigatória
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.sigla.minLength || !$v.entity.sigla.maxLength">
                    Sigla deve ter entre 2 e 4 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>DDI</label><span class="isRequired"> *</span>
                <input id="ddi" type="text" class="form-control" v-uppercase v-model.lazy="entity.ddi"
                    :class="{'is-invalid': $v.entity.ddi.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.ddi.required">
                    DDI obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.ddi.minLength || !$v.entity.ddi.maxLength">
                    DDI deve ter entre 2 e 4 caracteres
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
                    <router-link v-if="!isModal" :to="{name: 'PaisesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength} from 'vuelidate/lib/validators'
import {PaisesService} from '@/services/paises.service'
import Helper from "@/components/helper";
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "PaisesEdit",
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
                pais: {
                    required,
                },
                sigla: {
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(4),
                },
                ddi: {
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(4),
                },
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                pais: null,
                sigla: null,
                ddi: null,
                dtCadastro: null,
                dtAlteracao: null 
            },
            dtCad: null,
            dtAlt: null,
            isLoading: false,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
        
            PaisesService.getById(this.entity.codigo).then(function (response) {
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

            PaisesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("País " + msg + " com sucesso");
                vm.isSubmiting = false;
                
                if(!vm.isModal){
                    vm.$router.push('/app/paises');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-pais', vm.entity);
                }
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>