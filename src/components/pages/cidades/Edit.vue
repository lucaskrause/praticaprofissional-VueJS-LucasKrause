<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Cidade</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Cidade</label><span class="isRequired"> *</span>
                <input id="cidade" type="text" class="form-control" v-uppercase v-model.lazy="entity.cidade"
                    :class="{'is-invalid': $v.entity.cidade.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.cidade.required">
                    Cidade obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.cidade.maxLength">
                    Cidade deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>DDD</label><span class="isRequired"> *</span>
                <the-mask id="ddd" class="form-control" v-model="entity.ddd"
                    mask="####"
                    :masked="false"
                    :class="{'is-invalid': $v.entity.ddd.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.ddd.required">
                    DDD obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.ddd.minLength || !$v.entity.ddd.maxLength">
                    DDD deve ter entre 2 e 4 caracteres
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>Estado</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoEstado" type="number" class="form-control" v-model.number="entity.codigoEstado" @input="onSearchEstado"
                        :class="{'is-invalid': $v.entity.codigoEstado.$error}"/>
                    <div class="input-group-append">
                        <input id="estado" type="text" class="form-control" v-model.lazy="estadoSelecionado" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-estado class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoEstado.minValue">
                        Selecione um Estado
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
                    <router-link v-if="!isModal" :to="{name: 'CidadesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-estado" size="xl" title="Consultar Estado" hide-footer>
            <ConsultaEstado @emit-estado="selectEstado" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, minValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import Helper from '@/components/helper'
import {EstadosService} from '@/services/estados.service'
import {CidadesService} from '@/services/cidades.service'
import ConsultaEstado from '@/components/pages/estados/Consult.vue'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "CidadesEdit",
    components: { TheMask, ConsultaEstado },
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
                cidade: {
                    required,
                    maxLength: maxLength(50),
                },
                ddd: {
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(4),
                },
                codigoEstado: {
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
                cidade: null,
                ddd: null,
                codigoEstado: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
            estadoSelecionado: null,
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
            
            CidadesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.estadoSelecionado = response.data.estado.estado;
            });
        }
    },
    methods: {
        selectEstado(entity) {
            this.estadoSelecionado = entity.estado;
            this.entity.codigoEstado = entity.codigo;
            this.$bvModal.hide("modal-new-estado");
            this.$bvModal.hide("modal-consult-estado");
        },
        onSearchEstado() {
            this.searchEstado(this);
        },
        searchEstado: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoEstado > 0) {
                EstadosService.getById(vm.entity.codigoEstado).then(function (response) {
                    vm.estadoSelecionado = response.data.estado;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoEstado = 0;
                    vm.estadoSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Estado não encontrado");
                });
            } else {
                vm.estadoSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.$v.$touch();
            const vm = this;

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }

            CidadesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : "criado";
                notyf.success("Cidade " + msg + " com sucesso");
                vm.isSubmiting = false;

                if(!vm.isModal){
                    vm.$router.push('/app/cidades');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-cidade", vm.entity);
                }
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>