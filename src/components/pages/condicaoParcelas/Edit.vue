<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de País</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-2">
                <label>Número de Dias</label><span class="isRequired"> *</span>
                <input id="numeroDias" type="number" class="form-control" v-model.number="entity.numeroDias"
                    :class="{'is-invalid': $v.entity.numeroDias.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.numeroDias.required || !$v.entity.numeroDias.minValue">
                    Número de Dias obrigatório
                </div>
            </div>

            <div class="col-2">
                <label>Porcentagem (%)</label><span class="isRequired"> *</span>
                <input id="porcentagem" type="number" class="form-control" v-model.number="entity.porcentagem"
                    :class="{'is-invalid': $v.entity.porcentagem.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.porcentagem.required">
                    Porcentagem obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.porcentagem.minValue || !$v.entity.porcentagem.maxValue">
                    Porcentagem deve ser entre 0.0001 e {{ this.porcentagem }}
                </div>
            </div>

            <div class="col-5">
                <label>Forma de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFormaPagamento" type="number" class="form-control" v-model.number="entity.codigoFormaPagamento" @input="searchForma"
                        :class="{'is-invalid': $v.entity.codigoFormaPagamento.$error}"/>
                    <div class="input-group-append">
                        <input id="formaPagamento" type="text" class="form-control" v-uppercase v-model.lazy="entity.formaPagamento.descricao" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-formaPagamento class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoFormaPagamento.minValue">
                        Selecione um Forma de Pagamento
                    </div>
                </div>
            </div>
        </div>

        <div class="row form-group align-items-end mt-5">
            <div class="col-12">
                <div class="text-right">
                    <router-link v-if="!isModal" :to="{name: 'ParcelasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consult-formaPagamento" size="xl" title="Consultar Forma de Pagamento" hide-footer>
            <ConsultaFormaPagamento @emit-forma="selectForma" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minValue, maxValue} from 'vuelidate/lib/validators'
import {FormasPagamentoService} from '@/services/formasPagamento.service'
import ConsultaFormaPagamento from '@/components/pages/formasPagamento/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ParcelasEdit",
    components: { ConsultaFormaPagamento },
    props: {
        isModal: {
            type: Boolean,
            default: false
        },
        numeroParcela: {
            type: Number,
            default: 0
        },
        editParcela: {
            type: Object,
            default: null
        },
        porcentagem: {
            type: Number,
            default: 100
        }
    },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                numeroDias: {
                    required,
                    minValue: minValue(1),
                },
                porcentagem: {
                    required,
                    minValue: minValue(0.0001),
                    maxValue: maxValue(this.porcentagem),
                },
                codigoFormaPagamento: {
                    required,
                    minValue: minValue(1),
                },
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                numeroParcela: 0,
                numeroDias: null,
                porcentagem: null,
                codigoFormaPagamento: 0,
                formaPagamento: {
                    codigo: 0,
                    descricao: null
                }
            },
            isLoading: false,
            isSubmiting: false
        }
    },
    created() {
        if (this.isModal) {
            // new parcela
            if (this.numeroParcela > 0) {
                this.entity.numeroParcela = this.numeroParcela;
            } 
            // edit parcela
            else {
                this.entity = this.editParcela;
            }
        }
    },
    methods: {
        selectForma(entity) {
            this.entity.formaPagamento.descricao = entity.descricao;
            this.entity.formaPagamento.codigo = entity.codigo;
            this.entity.codigoFormaPagamento = entity.codigo;
            this.$bvModal.hide("modal-new-formaPagamento");
            this.$bvModal.hide("modal-consult-formaPagamento");
        },
        searchForma() {
            this.isLoading = true;
            var vm = this;
            if (vm.entity.codigoFormaPagamento > 0) {
                FormasPagamentoService.getById(vm.entity.codigoFormaPagamento).then(function (response) {
                    vm.entity.formaPagamento.codigo = response.data.codigo;
                    vm.entity.formaPagamento.descricao = response.data.descricao;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoFormaPagamento = 0;
                    vm.entity.formaPagamento.codigo = 0;
                    vm.entity.formaPagamento.descricao = null;
                    vm.isLoading = false;
                    notyf.error("Forma de Pagamento não encontrada");
                });
            } else {
                vm.entity.formaPagamento.descricao = null;
                vm.isLoading = false;
            }
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.$v.$touch();

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }

            this.entity.formaPagamento.codigo = this.entity.codigoFormaPagamento;
            this.$emit('emit-parcela', this.entity);
        }
    }
}
</script>