<template>
    
    <div class="col-12">
        <h2>Comprar</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-2">
                <label>Modelo</label><span class="isRequired"> *</span>
                <input id="modelo" type="number" class="form-control" v-model="entity.modelo" :disabled="verificaListaProdutos" />
            </div>

            <div class="col-2">
                <label>Série</label><span class="isRequired"> *</span>
                <input id="serie" type="number" class="form-control" v-model="entity.serie" :disabled="verificaListaProdutos" />
            </div>

            <div class="col-2">
                <label>Nº Nota</label><span class="isRequired"> *</span>
                <input id="numeroNota" type="number" class="form-control" v-model="entity.numeroNota" :disabled="verificaListaProdutos" />
            </div>

            <div class="col-4">
                <label>Fornecedor</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoFornecedor" type="number" class="form-control" v-model.number="entity.codigoFornecedor" @input="searchFornecedor" :disabled="verificaListaProdutos" />
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="fornecedorSelecionado" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-fornecedor class="btn btn-info ml-1" :disabled="verificaListaProdutos" >Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Data Emissão</label> 
                <input id="dataEmissao" type="date" class="form-control" v-model="entity.dataEmissao" :disabled="verificaListaProdutos || verificaNota" />
            </div>

            <div class="col-2">
                <label>Data Entrega</label> 
                <input id="dataEntrega" type="date" class="form-control" v-model="entity.dataEntrega" :disabled="verificaListaProdutos || verificaNota" />
            </div>
        </div>

        <hr/>
        <h4>Produtos</h4>
        <div class="row form-group">
            <div class="col-4">
                <label>Produto</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoProduto" type="number" class="form-control" v-model.number="produtoSelecionado.codigo" @input="searchProduto" :disabled="!verificaDtEmissaoEntrega" />
                    <div class="input-group-append">
                        <input type="text" class="form-control" v-model.lazy="produtoSelecionado.produto" readonly/>
                    </div>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-produto class="btn btn-info ml-1" :disabled="!verificaDtEmissaoEntrega">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Quantidade</label> 
                <input id="qtde" type="number" class="form-control" v-model="produtoSelecionado.quantidade" :disabled="!verificaDtEmissaoEntrega" />
            </div>

            <div class="col-2">
                <label>Valor unitário</label> 
                <input id="valorUnitario" type="number" class="form-control" v-model="produtoSelecionado.valorUnitario" :disabled="!verificaDtEmissaoEntrega" />
            </div>

            <div class="col-2">
                <label>Desconto</label> 
                <input id="desconto" type="number" class="form-control" v-model="produtoSelecionado.desconto" :disabled="!verificaDtEmissaoEntrega" />
            </div>

            <div class="col-2">
                <label>Total</label> 
                <input id="total" type="number" class="form-control" v-model="produtoSelecionado.total" disabled/>
            </div>

            <div class="col-2">
                <button id="addProduto" type="button" class="btn btn-success embaixo" @click="addProduto" :disabled="!verificaDtEmissaoEntrega">Adicionar Produto</button>
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
                            <router-link :to="{name: 'ProdutosEdit', params: {codigo: props.row.codigo}}" class="btn btn-sm btn-primary mr-3">Editar</router-link>
                            <a @click.prevent="remove(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
        
        <hr/>
        <h4>Condição de Pagamento</h4>
        <div class="row form-group">
            <div class="col-4">
                <label>Condição de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                   <input id="codigoCondicaoPagamento" type="number" class="form-control" v-model.number="entity.codigoCondicaoPagamento" @input="searchCondicao" :disabled="!verificaListaProdutos"/>
                    <div class="input-group-append">
                        <input id="condicaoPagamento" type="text" class="form-control" v-uppercase v-model.lazy="condicaoSelecionada" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-condicaoPagamento class="btn btn-info ml-1" :disabled="!verificaListaProdutos">Buscar</b-button>
                        </span>
                    </div>
                </div>
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

            <div class="col-10">
                <div class="text-right">
                    <router-link :to="{name: 'ComprasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                    <input type="submit" value="Cancelar" class="btn btn-primary ml-3" @click.prevent="cancel()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-fornecedor" size="xl" title="Consultar Fornecedor" hide-footer>
            <ConsultaFornecedor @emit-fornecedor="selectFornecedor" />
        </b-modal>

        <b-modal id="modal-consult-produto" size="xl" title="Consultar Produto" hide-footer>
            <ConsultaProduto @emit-produto="selectProduto" />
        </b-modal>

        <b-modal id="modal-consult-condicaoPagamento" size="xl" title="Consultar Condição de Pagamento" hide-footer>
            <ConsultaCondicaoPagamento @emit-condicao="selectCondicao" />
        </b-modal>
    </div>
</template>

<script>
import {ComprasService} from '@/services/compras.service'
import ConsultaFornecedor from '@/components/pages/fornecedores/Consult.vue'
import ConsultaProduto from '@/components/pages/produtos/Consult.vue'
import ConsultaCondicaoPagamento from '@/components/pages/condicoesPagamento/Consult.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';

export default {
    name: "ComprasEdit",
    components: { ConsultaFornecedor, ConsultaProduto, ConsultaCondicaoPagamento, VueGoodTable },
    data() {
        return {
            entity: {
                modelo: null,
                serie: null,
                numeroNota: null,
                codigoFornecedor: 0,
                produtos: [],
                dataEmissao: null,
                dataEntrega: null
            },
            dtCad: null,
            fornecedorSelecionado: null,
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
                        field: "codigo",
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
                        width: "160px",
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
                        label: "Dias",
                        field: "numeroDias",
                        type: "number",
                        width: "120px",
                    },
                    {
                        label: "Porcentagem (%)",
                        field: "porcentagem",
                        type: "number",
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
        }
    },
    computed: {
        verificaNota() {
            if (this.entity.modelo && this.entity.serie && this.entity.numeroNota && this.entity.codigoFornecedor > 0) {
                // TODO: Validar Nota existente aqui
                return false;
            }
            return true;
        },
        verificaDtEmissaoEntrega() {
            if (this.entity.dataEmissao && this.entity.dataEntrega) {
                var today = new Date(new Date().toDateString());
                var emissao = new Date(this.entity.dataEmissao.replace(/-/g, '/'));
                var entrega = new Date(this.entity.dataEntrega.replace(/-/g, '/'));

                if (emissao <= today) {
                    if (entrega >= emissao) {
                        return true;
                    } else {
                        alert("Entrega inválida");
                        return false;
                    }
                } else {
                    alert("Emissão inválida");
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
        }
    },
    methods: {
        searchFornecedor() {
            return false;
        },
        selectFornecedor() {
            return false;
        },
        searchProduto() {
            return false;
        },
        selectProduto(entity) {
            this.produtoSelecionado = entity;
            this.$bvModal.hide("modal-new-produto");
            this.$bvModal.hide("modal-consult-produto");
        },
        searchCondicao() {
            return false;
        },
        selectCondicao() {
            return false;
        },
        addProduto() {
            this.produtos.rows.push(this.produtoSelecionado);
        },
        save() {
            ComprasService.save(this.entity).then(function () {
                
            });
        }
    }
}
// Compra -> validar nota - liberar data de emissão e entrega

// Data de Emissão deve ser menor ou igual ao dia de hoje
// Data de Entrega deve ser maior ou igual ao dia de Emissão
// Datas liberam Produtos

// Ao selecionar Produto deve ser bloqueado Nota e Datas e liberar Condição de Pagamento
</script>

<style>
.embaixo{
   position: absolute;
   bottom: 0px;
}
</style>