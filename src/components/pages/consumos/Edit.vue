<template>
    <div class="col-12">
        <h2>Cadastro de Consumo</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>
            
            <div class="col-4">
                <label>Funcionário</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFuncionario" type="number" class="form-control" v-model.number="entity.codigoFuncionario" @input="onSearchFuncionario"
                        :class="{'is-invalid': $v.entity.codigoFuncionario.$error}"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="funcionarioSelecionado" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-funcionario class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoFuncionario.minValue">
                        Selecione um funcionário
                    </div>
                </div>
            </div>
            
            <div class="col-4">
                <label>Produto</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoProduto" type="number" class="form-control" v-model.number="entity.codigoProduto" @input="onSearchProduto" :disabled="isEdit"
                        :class="{'is-invalid': $v.entity.codigoProduto.$error}"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="produtoSelecionado" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-produto class="btn btn-info ml-1" :disabled="isEdit">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoProduto.minValue">
                        Selecione um produto
                    </div>
                </div>
            </div>

            <div class="col-1">
                <label>Quantidade</label><span class="isRequired"> *</span>
                <input id="quantidade" type="number" class="form-control" v-model.number="entity.quantidade" :disabled="isEdit"/>
            </div>
        </div>
        
        <div class="row form-group">
            <div class="col-5">
                <label>Observação</label><span class="isRequired"> *</span>
                <textarea id="observacao" class="form-control" maxlength="100" v-model="entity.observacao"></textarea>
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
                    <router-link :to="{name: 'ConsumosList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-funcionario" size="xl" title="Consultar Funcionário" hide-footer>
            <ConsultaFuncionario @emit-funcionario="selectFuncionario" :isModal="true"/>
        </b-modal>

        <b-modal id="modal-consult-produto" size="xl" title="Consultar Produto" hide-footer>
            <ConsultaProduto @emit-produto="selectProduto" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {ConsumosService} from '@/services/consumos.service'
import {FuncionariosService} from '@/services/funcionarios.service'
import {ProdutosService} from '@/services/produtos.service'
import ConsultaFuncionario from '@/components/pages/funcionarios/Consult.vue'
import ConsultaProduto from '@/components/pages/produtos/Consult.vue'
import {validationMixin} from 'vuelidate'
import {minValue} from 'vuelidate/lib/validators'
import Helper from '@/components/helper'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "ConsumosEdit",
    components: { ConsultaFuncionario, ConsultaProduto },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                codigoFuncionario: {
                    minValue: minValue(1),
                },
                codigoProduto: {
                    minValue: minValue(1),
                },
                quantidade: {
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
                codigoFuncionario: 0,
                codigoProduto: 0,
                quantidade: 0,
                observacao: null,
                dtCadastro: null,
                dtAlteracao: null
            },
            funcionarioSelecionado: null,
            produtoSelecionado: null,
            dtCad: null,
            dtAlt: null,
            isLoading: false,
            isSubmiting: false,
            isEdit: false,
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.isEdit = true;
            this.entity.codigo = this.$route.params.codigo;
        
            ConsumosService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);
                
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.funcionarioSelecionado = response.data.funcionario.nome;
                vm.produtoSelecionado = response.data.produto.produto;
            });
        }
    },
    methods: {
        selectFuncionario(entity) {
            this.funcionarioSelecionado = entity.nome;
            this.entity.codigoFuncionario = entity.codigo;
            this.$bvModal.hide("modal-new-funcionario");
            this.$bvModal.hide("modal-consult-funcionario");
        },
        onSearchFuncionario() {
            this.searchFuncionario(this);
        },
        searchFuncionario: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoFuncionario > 0) {
                FuncionariosService.getById(vm.entity.codigoFuncionario).then(function (response) {
                    vm.funcionarioSelecionado = response.data.funcionario;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoFuncionario = 0;
                    vm.funcionarioSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("País não encontrado");
                });
            } else {
                vm.funcionarioSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        selectProduto(entity) {
            this.produtoSelecionado = entity.produto;
            this.entity.codigoProduto = entity.codigo;
            this.$bvModal.hide("modal-new-produto");
            this.$bvModal.hide("modal-consult-produto");
        },
        onSearchProduto() {
            this.searchProduto(this);
        },
        searchProduto: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoProduto > 0) {
                ProdutosService.getById(vm.entity.codigoProduto).then(function (response) {
                    vm.produtoSelecionado = response.data.produto;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoProduto = 0;
                    vm.produtoSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("País não encontrado");
                });
            } else {
                vm.produtoSelecionado = null;
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

            ConsumosService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : "criado";
                notyf.success("Consumo " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/consumos');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>