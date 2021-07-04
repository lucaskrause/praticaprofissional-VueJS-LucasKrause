<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Estado</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Estado</label><span class="isRequired"> *</span>
                <input id="estado" type="text" class="form-control" v-uppercase v-model.lazy="entity.estado"
                    :class="{'is-invalid': $v.entity.estado.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.estado.required">
                    Estado obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.estado.maxLength">
                    Estado deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>UF</label><span class="isRequired"> *</span>
                <the-mask id="uf" class="form-control" v-uppercase v-model.lazy="entity.uf"
                    mask="AAAA"
                    :masked="false"
                    :class="{'is-invalid': $v.entity.uf.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.uf.required">
                    UF obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.uf.minLength || !$v.entity.uf.maxLength">
                    UF deve ter entre 2 e 4 caracteres
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>País</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoPais" type="number" class="form-control" v-model.number="entity.codigoPais" @input="searchPais"
                        :class="{'is-invalid': $v.entity.codigoPais.$error}"/>
                    <div class="input-group-append">
                        <input type="text" class="input-group-text" v-model.lazy="paisSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-pais class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoPais.minValue">
                        Selecione um País
                    </div>
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
                    <router-link v-if="!isModal" :to="{name: 'EstadosList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-pais" size="xl" title="Consultar País" hide-footer>
            <ConsultaPais @emit-pais="selectPais" />
        </b-modal>
    </div>

</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, minValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import Helper from '@/components/helper'
import {PaisesService} from '@/services/paises.service'
import {EstadosService} from '@/services/estados.service'
import ConsultaPais from '@/components/pages/paises/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "EstadosEdit",
    components: { TheMask, ConsultaPais },
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
                estado: {
                    required,
                    maxLength: maxLength(50),
                },
                uf: {
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(4),
                },
                codigoPais: {
                    minValue: minValue(1),
                },
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                estado: null,
                uf: null,
                codigoPais: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
            paisSelecionado: null,
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
        
            EstadosService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);
                
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.paisSelecionado = response.data.pais.pais;
            });
        }
    },
    methods: {
        selectPais(entity) {
            this.paisSelecionado = entity.pais;
            this.entity.codigoPais = entity.codigo;
            this.$bvModal.hide("modal-new-pais");
            this.$bvModal.hide("modal-consult-pais");
        },
        searchPais() {
            this.isLoading = true;
            var vm = this;
            if (vm.entity.codigoPais > 0) {
                PaisesService.getById(vm.entity.codigoPais).then(function (response) {
                    vm.paisSelecionado = response.data.pais;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoPais = 0;
                    vm.paisSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("País não encontrado");
                });
            } else {
                vm.paisSelecionado = null;
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

            EstadosService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Estado " + msg + " com sucesso");
                vm.isSubmiting = false;
                
                if(!vm.isModal) {
                    vm.$router.push('/app/estados');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-estado', vm.entity);
                }
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>