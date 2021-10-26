<template>
    
    <div class="col-12">
        <h2>Comprar</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-2">
                <label>Modelo</label><span class="isRequired"> *</span>
                <input id="modelo" type="number" class="form-control" v-model="entity.modelo" @input="findCompra" :disabled="verificaListaProdutos" :readonly="isEdit"/>
            </div>

            <div class="col-2">
                <label>Série</label><span class="isRequired"> *</span>
                <input id="serie" type="number" class="form-control" v-model="entity.serie" @input="findCompra" :disabled="verificaListaProdutos" :readonly="isEdit"/>
            </div>

            <div class="col-2">
                <label>Nº Nota</label><span class="isRequired"> *</span>
                <input id="numeroNota" type="number" class="form-control" v-model="entity.numeroNF" @input="findCompra" :disabled="verificaListaProdutos" :readonly="isEdit"/>
            </div>

            <div class="col-4">
                <label>Fornecedor</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFornecedor" type="number" class="form-control" v-model.number="entity.codigoFornecedor" @input="onSearchFornecedor" :disabled="verificaListaProdutos" :readonly="isEdit"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="fornecedorSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-fornecedor class="btn btn-info ml-1" :disabled="verificaListaProdutos || isEdit">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Data Emissão</label><span class="isRequired"> *</span>
                <input id="dtEmissao" type="date" class="form-control" v-model="entity.dtEmissao" :disabled="verificaListaProdutos || !isNotaPreenchido" :readonly="isEdit"/>
            </div>

            <div class="col-2">
                <label>Data Entrega</label><span class="isRequired"> *</span>
                <input id="dtEntrega" type="date" class="form-control" v-model="entity.dtEntrega" :disabled="verificaListaProdutos || !isNotaPreenchido" :readonly="isEdit"/>
            </div>
        </div>

        <hr/>
        <h4>Produtos</h4>
        <div v-if="!isEdit" class="row form-group">
            <div class="col-4">
                <label>Produto</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoProduto" type="number" class="form-control" v-model.number="produtoSelecionado.codigoProduto" @input="onSearchProduto" :disabled="!verificaDtEmissaoEntrega || !condicaoPreenchida" :readonly="isEdit"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="produtoSelecionado.produto" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-produto class="btn btn-info ml-1" :disabled="!verificaDtEmissaoEntrega || !condicaoPreenchida" :readonly="isEdit">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div v-if="!isEdit" class="row form-group">
            <div class="col-2">
                <label>Quantidade</label><span class="isRequired"> *</span>
                <input id="qtde" type="number" class="form-control" v-model.number="produtoSelecionado.quantidade" :disabled="!verificaDtEmissaoEntrega || !condicaoPreenchida" :readonly="isEdit"/>
            </div>

            <div class="col-2">
                <label>Valor unitário</label><span class="isRequired"> *</span>
                <money id="valorUnitario" class="form-control text-right" v-model="produtoSelecionado.valorUnitario" v-bind="money" @change.native="calculaTotalProdutos" :disabled="!verificaDtEmissaoEntrega || !condicaoPreenchida" :readonly="isEdit"></money>
            </div>

            <div class="col-2">
                <label>Desconto</label> 
                <money id="desconto" class="form-control text-right" v-model="produtoSelecionado.desconto" v-bind="money" @change.native="calculaTotalProdutos" :disabled="!verificaDtEmissaoEntrega || !condicaoPreenchida" :readonly="isEdit"></money>
            </div>

            <div class="col-2">
                <label>Total</label>
                <money id="total" class="form-control text-right" v-model="produtoSelecionado.total" v-bind="money" disabled></money>
            </div>

            <div class="col-2">
                <button id="addProduto" type="button" class="btn btn-success embaixo" @click="addProduto" :disabled="!verificaDtEmissaoEntrega || produtoPreenchido || isEdit">Adicionar Produto</button>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode
                    :totalRows="produtos.totalRecords"
                    :columns="produtos.columns"
                    :rows="produtos.rows"
                    :search-options="{enabled: true, placeholder: 'Buscar'}"
                    :pagination-options="{perPage: 12, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <a v-if="condicaoPreenchida" @click.prevent="removeProduto(props.row)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>

        <div class="row form-group mt-3">
            <div class="col-2">
                <label>Valor Total Produtos</label>
                <money id="valorProdutos" class="form-control text-right" v-model="entity.valorProdutos" v-bind="money" @change.native="calculaTotalNota" readonly></money>
            </div>

            <div class="col-2">
                <label>Frete</label>
                <money id="frete" class="form-control text-right" v-model="entity.frete" v-bind="money" @change.native="calculaTotalNota" :disabled="isEdit"></money>
            </div>

            <div class="col-2">
                <label>Seguro</label>
                <money id="seguro" class="form-control text-right" v-model="entity.seguro" v-bind="money" @change.native="calculaTotalNota" :disabled="isEdit"></money>
            </div>

            <div class="col-2">
                <label>Despesas</label>
                <money id="despesas" class="form-control text-right" v-model="entity.despesas" v-bind="money" @change.native="calculaTotalNota" :disabled="isEdit"></money>
            </div>

            <div class="col-2">
                <label>Valor Total da Nota</label>
                <money id="valorTotal" class="form-control text-right" v-model="entity.valorTotal" v-bind="money" readonly></money>
            </div>
        </div>
        
        <hr/>
        <h4>Condição de Pagamento</h4>
        <div class="row form-group">
            <div class="col-4">
                <label>Condição de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                   <input id="codigoCondicaoPagamento" type="number" class="form-control" v-model.number="entity.codigoCondicaoPagamento" @input="onSearchCondicao" :disabled="!verificaListaProdutos" :readonly="isEdit"/>
                    <div class="input-group-append">
                        <input id="condicaoPagamento" type="text" class="form-control" v-uppercase v-model.lazy="condicaoSelecionada" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-condicaoPagamento class="btn btn-info ml-1" :disabled="!verificaListaProdutos || isEdit">Buscar</b-button>
                        </span>
                    </div>
                </div>
            </div>

            <div class="col-2">
                <button v-if="!isEdit" id="gerarParcela" type="button" class="btn btn-success embaixo" @click="gerarParcela()" :disabled="!condicaoSelecionada">Gerar Parcelas</button>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode
                    :columns="parcelas.columns"
                    :rows="parcelas.rows"
                    :search-options="{enabled: false}"
                    :pagination-options="{perPage: 12, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                </vue-good-table>
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
                    <router-link :to="{name: 'ComprasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input v-if="!isEdit" type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                    <input v-if="isEdit" type="submit" value="Cancelar" class="btn btn-primary" @click.prevent="cancel()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-fornecedor" size="xl" title="Consultar Fornecedor" hide-footer>
            <ConsultaFornecedor @emit-fornecedor="selectFornecedor" :isModal="true"/>
        </b-modal>

        <b-modal id="modal-consult-produto" size="xl" title="Consultar Produto" hide-footer>
            <ConsultaProduto @emit-produto="selectProduto" :isModal="true"/>
        </b-modal>

        <b-modal id="modal-consult-condicaoPagamento" size="xl" title="Consultar Condição de Pagamento" hide-footer>
            <ConsultaCondicaoPagamento @emit-condicao="selectCondicao" :isModal="true"/>
        </b-modal>
    </div>
</template>

<script>
import {ComprasService} from '@/services/compras.service'
import {FornecedoresService} from '@/services/fornecedores.service'
import {ProdutosService} from '@/services/produtos.service'
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import Helper from '@/components/helper'
import {Money} from 'v-money'
import ConsultaFornecedor from '@/components/pages/fornecedores/Consult.vue'
import ConsultaProduto from '@/components/pages/produtos/Consult.vue'
import ConsultaCondicaoPagamento from '@/components/pages/condicoesPagamento/Consult.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "ComprasEdit",
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        compra: {
            type: Object,
            default: null
        },    
    },
    components: { Money, ConsultaFornecedor, ConsultaProduto, ConsultaCondicaoPagamento, VueGoodTable },
    data() {
        return {
            entity: {
                modelo: null,
                serie: null,
                numeroNF: null,
                codigoFornecedor: 0,
                itens: [],
                valorProdutos: 0,
                frete: 0,
                seguro: 0,
                despesas: 0,
                valorTotal: 0,
                codigoCondicaoPagamento: 0,
                parcelas: [],
                dtEmissao: null,
                dtEntrega: null
            },
            dtCad: null,
            dtAlt: null,
            fornecedorSelecionado: null,
            isNotaPreenchido: false,
            valorTotal: 0,
            produtoSelecionado: {
                codigo: 0,
                produto: null,
                quantidade: 0,
                valorUnitario: 0,
                desconto: 0,
                total: 0
            },
            produtos: {
                columns: [
                    {
                        label: "Código",
                        field: "codigoProduto",
                        type: "number",
                        width: "100px",
                    },
                    {
                        label: "Produto",
                        field: "produto"
                    },
                    {
                        label: "Quantidade",
                        field: "quantidade",
                        type: "number",
                        width: "150px",
                    },
                    {
                        label: "Valor unitário",
                        field: "valorUnitario",
                        type: "number",
                        width: "150px",
                    },
                    {
                        label: "Desconto",
                        field: "desconto",
                        type: "number",
                        width: "150px",
                    },
                    {
                        label: "Total",
                        field: "total",
                        type: "number",
                        width: "150px",
                    },
                    {
                        label: "Ações",
                        sortable: false,
                        field: 'btn',
                        html: true,
                        width: "120px",
                    },
                ],
                rows: [],
                totalRecords: 0
            },
            condicaoSelecionada: null,
            parcelas: {
                columns: [
                    {
                        label: "Parcela",
                        field: "numeroParcela",
                        type: "number",
                        width: "120px",
                    },
                    {
                        label: "Valor",
                        field: "valorParcela",
                        type: "number",
                        width: "150px",
                    },
                    {
                        label: "Data de Vencimento",
                        field: "dtVencimento",
                        type: "date",
                        dateInputFormat: 'yyyy-MM-dd',
                        dateOutputFormat: 'dd/MM/yyyy',
                        width: "200px",
                    },
                    {
                        label: "Forma de Pagamento",
                        field: "formaPagamento.descricao"
                    }
                ],
                rows: [],
                totalRecords: 0
            },
            isSubmiting: false,
            money: {
                decimal: ',',
                thousands: '.',
                prefix: 'R$ ',
                suffix: '',
                precision: 2,
                masked: false
            },
        }
    },
    created() {
        if (this.$route.name == "ComprasEdit") {
            if (this.compra) {
                let vm = this;
                ComprasService.getCompra(this.compra).then(function (response) {
                    vm.entity = response.data;

                    vm.produtos.rows = vm.entity.itens;
                    vm.parcelas.rows = vm.entity.parcelas;
                    
                    for (let i = 0; i < vm.parcelas.rows.length; i++) {
                        var dateVencimento = Helper.dateToDateString(vm.parcelas.rows[i].dtVencimento);

                        vm.parcelas.rows[i].dtVencimento = dateVencimento;
                    }

                    var dateEmissao = Helper.dateToDateString(vm.entity.dtEmissao);
                    var dateEntrega = Helper.dateToDateString(vm.entity.dtEntrega);
                    var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                    var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                    vm.entity.dtEmissao = dateEmissao;
                    vm.entity.dtEntrega = dateEntrega;
                    vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                    vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                    vm.fornecedorSelecionado = vm.entity.fornecedor.nome;
                    vm.condicaoSelecionada = vm.entity.condicaoPagamento.descricao;

                    for (let i = 0; i < vm.produtos.rows.length; i++) {
                        vm.valorTotal += vm.produtos.rows[i].total;
                    }
                });
            } else {
                this.$router.push('/app/compras');
            }
        }
    },
    computed: {
        verificaDtEmissaoEntrega() {
            if (this.entity.dtEmissao && this.entity.dtEntrega) {
                var today = new Date(new Date().toDateString());
                var emissao = new Date(this.entity.dtEmissao.replace(/-/g, '/'));
                var entrega = new Date(this.entity.dtEntrega.replace(/-/g, '/'));
                
                if (emissao <= today) {
                    if (entrega >= emissao) {
                        return true;
                    } else {
                        notyf.error("Data de Entrega inválida");
                        return false;
                    }
                } else {
                    notyf.error("Data de Emissão inválida");
                    return false;
                }
            }
            return false;
        },
        verificaListaProdutos() {
            if (this.produtos.rows.length > 0) {
                return true;
            }
            return false;
        },
        produtoPreenchido() {
            if (this.produtoSelecionado.codigoProduto > 0 && this.produtoSelecionado.quantidade > 0 && this.produtoSelecionado.valorUnitario > 0) {
                return false;
            }
            return true;
        },
        condicaoPreenchida() {
            if (this.entity.codigoCondicaoPagamento > 0 && this.condicaoSelecionada != null) {
                return false;
            }
            return true;
        }
    },
    methods: {
        findCompra() {
            let vm = this;
            if (this.entity.modelo && this.entity.serie && this.entity.numeroNF && this.fornecedorSelecionado != null) {
                ComprasService.find(this.entity).then(function (response) {
                    vm.isNotaPreenchido = response.data;
                    if (vm.isNotaPreenchido) {
                        notyf.success("Nota de compra disponível!");
                    } else {
                        notyf.error("Nota de compra já cadastrada!");
                    }
                }).catch(() => this.isNotaPreenchido = false);
            } else {
                this.isNotaPreenchido = false;
            }
        },
        onSearchFornecedor() {
            this.searchFornecedor(this);
        },
        searchFornecedor: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoFornecedor > 0) {
                FornecedoresService.getById(vm.entity.codigoFornecedor).then(function (response) {
                    vm.fornecedorSelecionado = response.data.nome;
                    vm.isLoading = false;
                    vm.findCompra();
                }).catch(function() {
                    vm.entity.codigoFornecedor = 0;
                    vm.fornecedorSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Fornecedor não encontrada");
                    vm.findCompra();
                });
            } else {
                vm.fornecedorSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        selectFornecedor(entity) {
            this.entity.codigoFornecedor = entity.codigo;
            this.fornecedorSelecionado = entity.nome;
            this.$bvModal.hide("modal-new-fornecedor");
            this.$bvModal.hide("modal-consult-fornecedor");
            this.findCompra();
        },
        onSearchProduto() {
            this.searchProduto(this);
        },
        searchProduto: debounce((vm) => {
            vm.isLoading = true;
            if (vm.produtoSelecionado.codigoProduto > 0) {
                ProdutosService.getById(vm.produtoSelecionado.codigoProduto).then(function (response) {
                    vm.produtoSelecionado.produto = response.data.produto;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.produtoSelecionado.codigoProduto = 0;
                    vm.produtoSelecionado.produto = null;
                    vm.isLoading = false;
                    notyf.error("Produto não encontrado");
                });
            } else {
                vm.produtoSelecionado = null;
                vm.isLoading = false;
            }
        }, 350),
        selectProduto(entity) {
            this.produtoSelecionado.codigoProduto = entity.codigo;
            this.produtoSelecionado.produto = entity.produto;
            this.$bvModal.hide("modal-new-produto");
            this.$bvModal.hide("modal-consult-produto");
        },
        onSearchCondicao() {
            this.searchCondicao(this);
        },
        searchCondicao: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoCondicaoPagamento > 0) {
                CondicoesPagamentoService.getById(vm.entity.codigoCondicaoPagamento).then(function (response) {
                    vm.condicaoSelecionada = response.data.descricao;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCondicaoPagamento = 0;
                    vm.condicaoSelecionada = null;
                    vm.isLoading = false;
                    notyf.error("Condição de Pagamento não encontrada");
                });
            } else {
                vm.condicaoSelecionada = null;
                vm.isLoading = false;
            }
        }, 350),
        selectCondicao(entity) {
            this.entity.codigoCondicaoPagamento = entity.codigo;
            this.condicaoSelecionada = entity.descricao;
            this.$bvModal.hide("modal-new-condicaoPagamento");
            this.$bvModal.hide("modal-consult-condicaoPagamento");
        },
        calculaTotalProdutos() {
            if(this.produtoSelecionado.quantidade > 0 && this.produtoSelecionado.valorUnitario > 0) {
                this.produtoSelecionado.total = this.produtoSelecionado.quantidade * this.produtoSelecionado.valorUnitario - this.produtoSelecionado.desconto;
            }
        },
        calculaTotalNota() {
            if(this.entity.frete > 0 || this.entity.seguro > 0 || this.entity.despesas > 0) {
                this.entity.valorTotal = this.entity.valorProdutos + this.entity.frete + this.entity.seguro + this.entity.despesas;
            }
        },
        addProduto() {
            this.entity.valorProdutos += this.produtoSelecionado.total;
            this.produtos.rows.push(this.produtoSelecionado);
            this.produtoSelecionado = {
                codigo: 0,
                produto: null,
                quantidade: 0,
                valorUnitario: 0,
                desconto: 0,
                total: 0
            };
        },
        removeProduto(entity) {
            this.entity.valorProdutos -= entity.total;
            this.produtos.rows.splice(entity.index, 1);
        },
        gerarParcela() {
            const vm = this;

            var params = {
                codigoCondicaoPagamento: this.entity.codigoCondicaoPagamento,
                dtEmissao: this.entity.dtEmissao,
                valorTotal: this.entity.valorTotal
            };

            ComprasService.gerarParcelas(params).then(function (response) {
                vm.parcelas.totalRecords = response.data.length;
                vm.parcelas.rows = response.data;
                
                for (let i = 0; i < vm.parcelas.totalRecords; i++) {
                    var dateVencimento = Helper.dateToDateString(vm.parcelas.rows[i].dtVencimento);

                    vm.parcelas.rows[i].dtVencimento = dateVencimento;
                }
            });
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            let vm = this;

            this.entity.itens = this.produtos.rows;
            this.entity.parcelas = this.parcelas.rows;
            ComprasService.save(this.entity).then(function () {
                notyf.success("Compra registrada com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/compras');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        },
        cancel() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            let vm = this;

            ComprasService.cancel(this.entity).then(function () {
                notyf.success("Compra cancelada com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/compras');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        }
    }
}
</script>

<style>
.embaixo{
   position: absolute;
   bottom: 0px;
}
</style>