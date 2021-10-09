<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Produto</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Produto</label><span class="isRequired"> *</span>
                <input id="produto" type="text" class="form-control" v-uppercase v-model.lazy="entity.produto"
                    :class="{'is-invalid': $v.entity.produto.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.produto.required">
                    Produto obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.produto.maxLength">
                    Produto deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>Unidades</label><span class="isRequired"> *</span>
                <input id="unidades" type="number" class="form-control" v-model.number="entity.unidades"
                    :class="{'is-invalid': $v.entity.unidades.$error}"/>
                    <div class="invalid-feedback" v-if="!$v.entity.unidades.minValue">
                        Unidades deve ser no mínimo 1
                    </div>
            </div>

            <div class="col-2">
                <label>Valor de Custo</label><span class="isRequired"> *</span>
                <money id="valorCusto" class="form-control text-right" v-model="entity.valorCusto"
                    v-bind="money"
                    :class="{'is-invalid': $v.entity.valorCusto.$error}"></money>
                <div class="invalid-feedback" v-if="!$v.entity.valorCusto.minValue || !$v.entity.valorCusto.maxValue">
                    Valor de custo deve ser entre 0,01 e 99.999.999,99
                </div>
            </div>

            <div class="col-2">
                <label>Estoque</label><span class="isRequired"> *</span>
                <input id="estoque" type="number" class="form-control" v-model.number="entity.estoque"
                    :class="{'is-invalid': $v.entity.estoque.$error}"/>
                    <div class="invalid-feedback" v-if="!$v.entity.estoque.minValue">
                        Estoque deve ser no mínimo 1
                    </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>Categoria</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCategoria" type="number" class="form-control" v-model.number="entity.codigoCategoria" @input="searchCategoria"
                        :class="{'is-invalid': $v.entity.codigoCategoria.$error}"/>
                    <div class="input-group-append">
                        <input id="categoria" type="text" class="form-control" v-model.lazy="categoriaSelecionada" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-categoria class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCategoria.minValue">
                        Selecione uma Categoria
                    </div>
                </div>
            </div>

            <div class="col-2">
                <label>Data da últ. compra</label> 
                <input id="dtUltimaCompra" type="date" class="form-control" v-model="entity.dtUltimaCompra"/>
            </div>

            <div class="col-2">
                <label>Valor da últ. compra</label>
                <money id="valorUltimaCompra" class="form-control text-right" v-model="entity.valorUltimaCompra"
                    v-bind="money"
                    :class="{'is-invalid': $v.entity.valorUltimaCompra.$error}"></money>
                <div class="invalid-feedback" v-if="!$v.entity.valorCusto.minValue || !$v.entity.valorCusto.maxValue">
                    Valor de custo deve ser no máximo 99.999.999,99
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
                    <router-link v-if="!isModal" :to="{name: 'ProdutosList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-categoria" size="xl" title="Consultar Categoria" hide-footer>
            <ConsultaCategoria @emit-categoria="selectCategoria" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, maxLength, minValue, maxValue} from 'vuelidate/lib/validators'
import {Money} from 'v-money'
import {CategoriasService} from '@/services/categorias.service'
import {ProdutosService} from '@/services/produtos.service'
import ConsultaCategoria from '@/components/pages/categorias/Consult.vue'
import Helper from '@/components/helper'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ProdutosEdit",
    components: { Money, ConsultaCategoria },
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
                produto: {
                    required,
                    maxLength: maxLength(50),
                },
                unidades: {
                    minValue: minValue(1),
                },
                valorCusto: {
                    required,
                    minValue: minValue(0.01),
                    maxValue: maxValue(99999999.99),
                },
                estoque: {
                    minValue: minValue(1),
                },
                codigoCategoria: {
                    minValue: minValue(1),
                },
                valorUltimaCompra: {
                    minValue: minValue(0.00),
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
                produto: null,
                unidades: 0,
                valorCusto: 0,
                estoque: 0,
                codigoCategoria: 0,
                dtUltimaCompra: null,
                valorUltimaCompra: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
            categoriaSelecionada: null,
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

            ProdutosService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                
                var dateUltCompra = Helper.dateToDateString(vm.entity.dtUltimaCompra);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                vm.entity.dtUltimaCompra = dateUltCompra;
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.categoriaSelecionada = response.data.categoria.descricao;
            });
        }
    },
    methods: {
        selectCategoria(entity) {
            this.categoriaSelecionada = entity.descricao;
            this.entity.codigoCategoria = entity.codigo;
            this.$bvModal.hide("modal-new-categoria");
            this.$bvModal.hide("modal-consult-categoria");
        },
        searchCategoria() {
            this.isLoading = true;
            var vm = this;
            if (vm.entity.codigoCategoria > 0) {
                CategoriasService.getById(vm.entity.codigoCategoria).then(function (response) {
                    vm.categoriaSelecionada = response.data.descricao;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCategoria = 0;
                    vm.categoriaSelecionada = null;
                    vm.isLoading = false;
                    notyf.error("Categoria não encontrado");
                });
            } else {
                vm.categoriaSelecionada = null;
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

            ProdutosService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Produto " + msg + " com sucesso");
                vm.isSubmiting = false;

                if(!vm.isModal){
                    vm.$router.push('/app/produtos');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-produto", vm.entity);
                }
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    },
}
</script>