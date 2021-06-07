<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Clientes</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>
            
            <div class="col-2">
                <label>Tipo Pessoa</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="PF" v-model="entity.tipoPessoa"> Pessoa Física</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="PJ" v-model="entity.tipoPessoa"> Pessoa Jurídica</label>
            </div>

            <div class="col-5">
                <label>Cliente</label>
                <input id="nome" type="text" class="form-control" v-model="entity.nome"/>
            </div>

            <div class="col-2">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Feminino" v-model="entity.sexo"> Feminino</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Masculino" v-model="entity.sexo"> Masculino</label>
            </div>

            <div class="col-2">
                <label>Sócio</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Sim" v-model="socio" disabled> Sim</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Não" v-model="socio" disabled> Não</label>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-4">
                <label>Logradouro</label>
                <input id="logradouro" type="text" class="form-control" v-model="entity.logradouro"/>
            </div>

            <div class="col-2">
                <label>Complemento</label>
                <input id="complemento" type="text" class="form-control" v-model="entity.complemento"/>
            </div>
            <div class="col-4">
                <label>Bairro</label>
                <input id="bairro" type="text" class="form-control" v-model="entity.bairro"/>
            </div>

            <div class="col-2">
                <label>CEP</label>
                <input id="cep" type="text" class="form-control" v-model="entity.cep"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigoCidade" type="number" class="form-control" v-model="entity.codigoCidade" readonly/>
            </div>
            
            <div class="col-4">
                <label>Cidade</label>
                <div class="input-group">
                    <input id="cidade" type="text" class="form-control" v-model="cidadeSelecionada" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-cidade class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-3">
                <label>Telefone</label>
                <input id="telefone" type="text" class="form-control" v-model="entity.telefone"/>
            </div>

            <div class="col-4">
                <label>Email</label>
                <input id="email" type="text" class="form-control" v-model="entity.email"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-3">
                <label>CPF / CNPJ</label>
                <input id="cpfCnpj" type="text" class="form-control" v-model="entity.cpfCnpj"/>
            </div>

            <div class="col-3">
                <label>RG / IE</label>
                <input id="rgIe" type="text" class="form-control" v-model="entity.rgIe"/>
            </div>

            <div class="col-3">
                <label>Data de Nascimento / Fundação</label>
                <input id="dtNascFundacao" type="date" class="form-control" v-model="entity.dtNascFundacao"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigoCondicaoPagamento" type="number" class="form-control" v-model="entity.codigoCondicaoPagamento" readonly/>
            </div>
            
            <div class="col-4">
                <label>Condição de Pagamento</label>
                <div class="input-group">
                    <input id="condicaoPagamento" type="text" class="form-control" v-model="condicaoSelecionada" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-condicaoPagamento class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div v-if="socio == 'Sim' && !isModal" class="row">
            <div class="col-3">
                <label>Dependentes</label>
            </div>

            <div class="col-9 text-right">
                <b-button v-b-modal.modal-new-dependente class="btn btn-success btn-sm">Cadastrar Dependente</b-button>
            </div>
        </div>
        <div v-if="socio == 'Sim' && !isModal" class="row mt-1">
            <div class="col-12">
                <vue-good-table compactMode
                    :columns="dependentes.columns"
                    :rows="dependentes.rows"
                    :search-options="{enabled: true, placeholder: 'Buscar'}"
                    :pagination-options="{perPage: 5, enabled: true}"
                >
                </vue-good-table>
            </div>
        </div>

        <div class="row form-group align-items-end mt-5">
            <div class="col-2">
                <label>Data de Cadastro</label>
                <input id="dataCadastro" type="text" class="form-control" v-model="entity.dtCadastro" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Alteração</label>
                <input id="dataAlteracao" type="text" class="form-control" v-model="entity.dtAlteracao" readonly/>
            </div>

            <div class="col-8">
                <div class="text-right">
                    <router-link v-if="!isModal" :to="{name: 'ClientesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consulta-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>
        
        <b-modal id="modal-consulta-condicaoPagamento" size="xl" title="Consultar Condição de Pagamento" hide-footer>
            <ConsultaCondicaoPagamento @emit-condicao="selectCondicao" />
        </b-modal>

        <b-modal id="modal-new-dependente" size="xl" title="Cadastrar Dependente" hide-footer>
            <NovoDependente @emit-dependente="selectDependente" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {ClientesService} from '@/services/clientes.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import ConsultaCondicaoPagamento from '@/components/pages/condicoesPagamento/Consult.vue'
import NovoDependente from '@/components/pages/dependentes/Edit.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ClientesEdit",
    components: { VueGoodTable, ConsultaCidade, ConsultaCondicaoPagamento, NovoDependente },
    props: {
        isModal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            entity: {
                codigo: 0,
                nome: "",
                sexo: "",
                tipoPessoa: "",
                logradouro: "",
                complemento: "",
                bairro: "",
                cep: "",
                codigoCidade: 0,
                telefone: "",
                email: "",
                cpfCnpj: "",
                rgIe: "",
                dtNascFundacao: "",
                codigoCondicaoPagamento: 0,
                dtCadastro: "",
                dtAlteracao: ""
            },
            socio: "Não",
            cidadeSelecionada: "",
            condicaoSelecionada: "",
            dependentes: {
                columns: [
                    {
                        label: "Nome",
                        field: "nome"
                    },
                    {
                        label: "CPF / CNPJ",
                        field: "cpfCnpj"
                    },
                    {
                        label: "Telefone",
                        field: "telefone"
                    },
                    {
                        label: "Tipo",
                        field: "tipo"
                    },
                    {
                        label: "Ações",
                        field: "btn"
                    }
                ],
                rows: [],
                page: 1,
                totalRecords: 0
            },
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
            
            ClientesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                vm.cidadeSelecionada = response.data.cidade.cidade;
                vm.condicaoSelecionada = response.data.condicaoPagamento.descricao;

                //TODO: Verificar tabela de cotas
            });
        }
    },
    methods: {
        selectCidade(entity) {
            this.cidadeSelecionada = entity.cidade;
            this.entity.codigoCidade = entity.codigo;
            this.$bvModal.hide("modal-new-cidade");
            this.$bvModal.hide("modal-consulta-cidade");
        },
        selectCondicao(entity) {
            this.condicaoSelecionada = entity.descricao;
            this.entity.codigoCondicaoPagamento = entity.codigo;
            this.$bvModal.hide("modal-new-condicaoPagamento");
            this.$bvModal.hide("modal-consulta-condicaoPagamento");
        },
        selectDependente(entity) {
            this.dependentes.rows.push(entity);
            this.$bvModal.hide("modal-new-dependente");
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            ClientesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Cliente " + msg + " com sucesso");
                vm.isSubmiting = false;
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-cliente", vm.entity);
                } else {
                    vm.$router.push('/app/clientes');
                }
            }); //.catch(function (errors) {Helper.saveErrorCallBack(errors.response)});
        }
    }
}
</script>

<style scoped>
    .labelRadio {
        display: inline-block;
        margin-bottom: 0 !important;
    }
</style>