<template>
    <div class="col-12">
        <h2>Ordem de Serviço</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-2">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Fornecedor</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFornecedor" type="number" class="form-control" v-model.number="entity.codigoFornecedor" @input="onSearchFornecedor" :disabled="condicaoPreenchida"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="fornecedorSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-fornecedor class="btn btn-info ml-1" :disabled="condicaoPreenchida">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-2">
                <label>Data Inicial</label><span class="isRequired"> *</span>
                <input id="dtInicial" type="date" class="form-control" v-model="entity.dtInicial" :disabled="condicaoPreenchida"/>
            </div>

            <div class="col-2">
                <label>Data Final</label><span class="isRequired"> *</span>
                <input id="dtFinal" type="date" class="form-control" v-model="entity.dtFinal" :disabled="condicaoPreenchida"/>
            </div>
        </div>

        <hr/>
        <h4>Serviços</h4>
        <div v-if="!isEdit" class="row form-group">
            <div class="col-4">
                <label>Serviço</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoServico" type="number" class="form-control" v-model.number="servicoSelecionado.codigoServico" @input="onSearchServico" :disabled="condicaoPreenchida"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="servicoSelecionado.descricao" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-servico class="btn btn-info ml-1" :disabled="condicaoPreenchida">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div v-if="!isEdit" class="row form-group">
            <div class="col-2">
                <label>Quantidade</label><span class="isRequired"> *</span>
                <input id="qtde" type="number" class="form-control" v-model.number="servicoSelecionado.quantidade" :disabled="!servicoSelecionado.descricao || condicaoPreenchida"/>
            </div>

            <div class="col-2">
                <label>Valor unitário</label><span class="isRequired"> *</span>
                <money id="valorUnitario" class="form-control text-right" v-model="servicoSelecionado.valorUnitario" v-bind="money" @change.native="calculaTotalServicos" :disabled="!servicoSelecionado.descricao || condicaoPreenchida"></money>
            </div>

            <div class="col-2">
                <label>Total</label>
                <money id="total" class="form-control text-right" v-model="servicoSelecionado.total" v-bind="money" disabled></money>
            </div>
            
            <div class="col-2">
                <button id="addServico" type="button" class="btn btn-success embaixo" @click="addServico" :disabled="!servicoSelecionado.descricao">Adicionar Serviço</button>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-12">
                <vue-good-table compactMode
                    :totalRows="servicos.totalRecords"
                    :columns="servicos.columns"
                    :rows="servicos.rows"
                    :search-options="{enabled: true, placeholder: 'Buscar'}"
                    :pagination-options="{perPage: 12, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <a v-if="!condicaoPreenchida" @click.prevent="removeServico(props.row)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>

        <div class="row form-group mt-3">
            <div class="col-2">
                <label>Valor Total dos Serviços</label>
                <money id="valorServicos" class="form-control text-right" v-model="entity.valorServicos" v-bind="money" readonly></money>
            </div>
        </div>

        <hr/>
        <h4>Produtos</h4>
        <div v-if="!isEdit" class="row form-group">
            <div class="col-4">
                <label>Produto</label>
                <div class="input-group">
                    <input id="codigoProduto" type="number" class="form-control" v-model.number="produtoSelecionado.codigoProduto" @input="onSearchProduto" :disabled="condicaoPreenchida"/>
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="produtoSelecionado.produto" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-produto class="btn btn-info ml-1" :disabled="condicaoPreenchida">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div v-if="!isEdit" class="row form-group">
            <div class="col-2">
                <label>Quantidade</label><span v-if="produtoSelecionado.produto" class="isRequired"> *</span>
                <input id="qtde" type="number" class="form-control" v-model.number="produtoSelecionado.quantidade" :disabled="!produtoSelecionado.produto || condicaoPreenchida"/>
            </div>

            <div class="col-2">
                <label>Valor unitário</label><span v-if="produtoSelecionado.produto" class="isRequired"> *</span>
                <money id="valorUnitario" class="form-control text-right" v-model="produtoSelecionado.valorUnitario" v-bind="money" @change.native="calculaTotalProdutos" :disabled="!produtoSelecionado.produto || condicaoPreenchida"></money>
            </div>

            <div class="col-2">
                <label>Desconto</label> 
                <money id="desconto" class="form-control text-right" v-model="produtoSelecionado.desconto" v-bind="money" @change.native="calculaTotalProdutos" :disabled="!produtoSelecionado.produto || condicaoPreenchida"></money>
            </div>

            <div class="col-2">
                <label>Total</label>
                <money id="total" class="form-control text-right" v-model="produtoSelecionado.total" v-bind="money" disabled></money>
            </div>
            
            <div class="col-2">
                <button id="addProduto" type="button" class="btn btn-success embaixo" @click="addProduto" :disabled="!produtoSelecionado.produto || condicaoPreenchida">Adicionar Produto</button>
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
                            <a v-if="!condicaoPreenchida" @click.prevent="removeProduto(props.row)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>

        <div class="row form-group mt-3">
            <div class="col-2">
                <label>Valor Total dos Produtos</label>
                <money id="valorProdutos" class="form-control text-right" v-model="entity.valorProdutos" v-bind="money" readonly></money>
            </div>

            <div class="offset-8 col-2">
                <label>Valor Total</label>
                <money id="valorTotal" class="form-control text-right" v-model="entity.valorTotal" v-bind="money" readonly></money>
            </div>
        </div>
        
        <hr/>
        <h4>Condição de Pagamento</h4>
        <div class="row form-group">
            <div class="col-4">
                <label>Condição de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                   <input id="codigoCondicaoPagamento" type="number" class="form-control" v-model.number="entity.codigoCondicaoPagamento" @input="onSearchCondicao" :disabled="!verificaListaServicos" :readonly="isEdit"/>
                    <div class="input-group-append">
                        <input id="condicaoPagamento" type="text" class="form-control" v-uppercase v-model.lazy="condicaoSelecionada" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-condicaoPagamento class="btn btn-info ml-1" :disabled="!verificaListaServicos || isEdit">Buscar</b-button>
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
                    <router-link :to="{name: 'OrdensServicoList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input v-if="!isEdit" type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                    <input v-if="isEdit" type="submit" value="Cancelar" class="btn btn-primary" @click.prevent="cancel()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-fornecedor" size="xl" title="Consultar Fornecedor" hide-footer>
            <ConsultaFornecedor @emit-fornecedor="selectFornecedor" :isModal="true"/>
        </b-modal>

        <b-modal id="modal-consult-servico" size="xl" title="Consultar Serviços" hide-footer>
            <ConsultaServico @emit-servico="selectServico" :isModal="true"/>
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
import {OrdensServicoService} from '@/services/ordensServico.service'
import {FornecedoresService} from '@/services/fornecedores.service'
import {ServicosService} from '@/services/servicos.service'
import {ProdutosService} from '@/services/produtos.service'
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import Helper from '@/components/helper'
import {Money} from 'v-money'
import ConsultaFornecedor from '@/components/pages/fornecedores/Consult.vue'
import ConsultaServico from '@/components/pages/servicos/Consult.vue'
import ConsultaProduto from '@/components/pages/produtos/Consult.vue'
import ConsultaCondicaoPagamento from '@/components/pages/condicoesPagamento/Consult.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

var debounce = require('lodash.debounce');

const notyf = new Notyf();

export default {
    name: "OrdensServicoCad",
    components: { Money, ConsultaFornecedor, ConsultaServico, ConsultaProduto, ConsultaCondicaoPagamento, VueGoodTable },
    data () {
        return {
            entity: {
                codigo: 0,
                codigoFornecedor: 0,
                dtInicial: null,
                dtFinal: null,
                servicos: [],
                valorServicos: 0,
                produtos: [],
                valorProdutos: 0,
                valorTotal: 0,
                codigoCondicaoPagamento: 0,
                parcelas: [],
            },
            dtCad: null,
            dtAlt: null,
            valorTotal: 0,
            isNotaPreenchido: false,
            fornecedorSelecionado: null,
            servicoSelecionado: {
                codigoServico: 0,
                descricao: null,
                quantidade: 0,
                valorUnitario: 0,
                total: 0
            },
            produtoSelecionado: {
                codigoProduto: 0,
                produto: null,
                quantidade: 0,
                valorUnitario: 0,
                valorCusto: 0,
                desconto: 0,
                total: 0
            },
            servicos: {
                columns: [
                    {
                        label: "Código",
                        field: "codigoServico",
                        type: "number",
                        width: "100px",
                    },
                    {
                        label: "Serviço",
                        field: "descricao"
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
                        label: "Subtotal",
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
                        label: "Custo",
                        field: "valorCusto",
                        type: "number",
                        width: "150px",
                    },
                    {
                        label: "Subtotal",
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
                        field: "valorApresentavel",
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
                    },
                    {
                        label: "Status",
                        field: "status",
                        width: "120px"
                    }
                ],
                rows: [],
                totalRecords: 0
            },
            money: {
                decimal: ',',
                thousands: '.',
                prefix: 'R$ ',
                suffix: '',
                precision: 2,
                masked: false
            },
            isSubmiting: false,
            isEdit: false,
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.isEdit = true;
            this.entity.codigo = this.$route.params.codigo;

            OrdensServicoService.getById(this.entity.codigo).then(function (response) {
                console.log(response.data);
                vm.entity = response.data;
                    
                vm.servicos.rows = vm.entity.servicos;
                vm.produtos.rows = vm.entity.itens;
                vm.parcelas.rows = vm.entity.parcelas;
                
                for (let i = 0; i < vm.parcelas.rows.length; i++) {
                    var dateVencimento = Helper.dateToDateString(vm.parcelas.rows[i].dtVencimento);

                    vm.parcelas.rows[i].dtVencimento = dateVencimento;
                    vm.parcelas.rows[i].valorApresentavel = Helper.number_format(vm.parcelas.rows[i].valorParcela);
                }

                var dateInicial = Helper.dateToDateString(vm.entity.dtInicial);
                var dateFinal = Helper.dateToDateString(vm.entity.dtFinal);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                vm.entity.dtInicial = dateInicial;
                vm.entity.dtFinal = dateFinal;
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;

                vm.fornecedorSelecionado = vm.entity.fornecedor.nome;
                vm.condicaoSelecionada = vm.entity.condicaoPagamento.descricao;
            });
        }
    },
    computed: {
        verificaDtInicialFinal() {
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
        verificaListaServicos() {
            if (this.servicos.rows.length > 0) {
                return true;
            }
            return false;
        },
        condicaoPreenchida() {
            if (this.entity.codigoCondicaoPagamento > 0 && this.condicaoSelecionada != null) {
                return true;
            }
            return false;
        }
    },
    methods: {
        onSearchFornecedor() {
            if (this.entity.codigoFornecedor == null || this.entity.codigoFornecedor == "") {
                this.entity.codigoFornecedor = 0;
                this.fornecedorSelecionado = null;
            }
            this.searchFornecedor(this);
        },
        searchFornecedor: debounce((vm) => {
            vm.isLoading = true;
            if (vm.entity.codigoFornecedor > 0) {
                FornecedoresService.getById(vm.entity.codigoFornecedor).then(function (response) {
                    vm.fornecedorSelecionado = response.data.nome;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoFornecedor = 0;
                    vm.fornecedorSelecionado = null;
                    vm.isLoading = false;
                    notyf.error("Fornecedor não encontrada");
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
        },
        onSearchServico() {
            if (this.servicoSelecionado.codigoServico == null || this.servicoSelecionado.codigoServico == "") {
                this.servicoSelecionado.codigoServico = 0;
                this.servicoSelecionado.descricao = null;
            }
            this.searchServico(this);
        },
        searchServico: debounce((vm) => {
            vm.isLoading = true;
            if (vm.servicoSelecionado.codigoServico > 0) {
                ServicosService.getById(vm.servicoSelecionado.codigoServico).then(function (response) {
                    vm.servicoSelecionado.descricao = response.data.descricao;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.servicoSelecionado.codigoServico = 0;
                    vm.servicoSelecionado.descricao = null;
                    vm.isLoading = false;
                    notyf.error("Serviço não encontrado");
                });
            } else {
                vm.isLoading = false;
            }
        }, 350),
        selectServico(entity) {
            this.servicoSelecionado.codigoServico = entity.codigo;
            this.servicoSelecionado.descricao = entity.descricao;
            this.servicoSelecionado.valorUnitario = entity.valor;
            this.$bvModal.hide("modal-new-servico");
            this.$bvModal.hide("modal-consult-servico");
        },
        onSearchProduto() {
            if (this.produtoSelecionado.codigoProduto == null || this.produtoSelecionado.codigoProduto == "") {
                this.produtoSelecionado.codigoProduto = 0;
                this.produtoSelecionado.produto = null;
            }
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
                vm.isLoading = false;
            }
        }, 350),
        selectProduto(entity) {
            this.produtoSelecionado.codigoProduto = entity.codigo;
            this.produtoSelecionado.produto = entity.produto;
            this.produtoSelecionado.valorUnitario = entity.valorCusto;
            this.$bvModal.hide("modal-new-produto");
            this.$bvModal.hide("modal-consult-produto");
        },
        onSearchCondicao() {
            if (this.entity.codigoCondicaoPagamento == null || this.entity.codigoCondicaoPagamento == "") {
                this.entity.codigoCondicaoPagamento = 0;
                this.condicaoSelecionada = null;
            }
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
        calculaTotalNota() {
            var total = 0;

            if (this.servicos.rows.length > 0) {
                total += this.servicos.rows.map(item => item.valorUnitario * item.quantidade).reduce((item1, item2) => item1 + item2);
            }

            if (this.produtos.rows.length > 0) {
                total += this.produtos.rows.map(item => item.valorCusto * item.quantidade).reduce((item1, item2) => item1 + item2);
            }
            
            this.entity.valorTotal = total;
        },
        calculaTotalServicos() {
            if(this.servicoSelecionado.quantidade > 0 && this.servicoSelecionado.valorUnitario > 0) {
                this.servicoSelecionado.total = this.servicoSelecionado.quantidade * this.servicoSelecionado.valorUnitario;
            }
            this.calculaTotalNota();
        },
        calculaTotalProdutos() {
            if(this.produtoSelecionado.quantidade > 0 && this.produtoSelecionado.valorUnitario > 0) {
                this.produtoSelecionado.valorCusto = this.produtoSelecionado.valorUnitario - this.produtoSelecionado.desconto;
                this.produtoSelecionado.total = (this.produtoSelecionado.quantidade * this.produtoSelecionado.valorCusto);
            }
            this.calculaTotalNota();
        },
        addServico() {
            this.entity.valorServicos += this.servicoSelecionado.total;
            this.servicos.rows.push(this.servicoSelecionado);
            this.servicoSelecionado = {
                codigoServico: 0,
                descricao: null,
                quantidade: 0,
                valorUnitario: 0,
                total: 0
            };
        },
        removeServico(entity) {
            this.entity.valorServicos -= entity.total;
            this.servicos.rows.splice(entity.index, 1);
        },
        addProduto() {
            this.entity.valorProdutos += this.produtoSelecionado.total;
            this.produtos.rows.push(this.produtoSelecionado);
            this.produtoSelecionado = {
                codigoProduto: 0,
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
                dtEmissao:  Helper.dateToDateString(new Date()),
                valorTotal: this.entity.valorTotal
            };

            OrdensServicoService.gerarParcelas(params).then(function (response) {
                vm.parcelas.totalRecords = response.data.length;
                vm.parcelas.rows = response.data;
                
                for (let i = 0; i < vm.parcelas.totalRecords; i++) {
                    vm.parcelas.rows[i].dtVencimento = Helper.dateToDateString(vm.parcelas.rows[i].dtVencimento);
                    vm.parcelas.rows[i].valorApresentavel = Helper.number_format(vm.parcelas.rows[i].valorParcela);
                }
            });
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            const vm = this;

            this.entity.servicos = this.servicos.rows;
            this.entity.itens = this.produtos.rows;
            this.entity.parcelas = this.parcelas.rows;
            OrdensServicoService.save(this.entity).then(function () {
                notyf.success("Ordem de Serviço registrada com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/ordemServico');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        },
        cancel() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            const vm = this;

            OrdensServicoService.cancel(this.entity).then(function () {
                notyf.success("Ordem de Serviço cancelada com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/ordemServico');
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