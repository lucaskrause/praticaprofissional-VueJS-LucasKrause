<template>
    <div class="col-12">
        <h2>Cadastro de Clientes</h2>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Nome Completo</label>
                <input id="nome" type="text" class="form-control" v-model="entity.nome"/>
            </div>

            <div class="col-3">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline mr-2"><input type="radio" value="Feminino" v-model="entity.sexo"> Feminino</label>
                <label class="radio-inline"><input type="radio" value="Masculino" v-model="entity.sexo"> Masculino</label>
            </div>
            
            <div class="col-3">
                <label>Tipo Pessoa</label>
                <br/>
                <label class="radio-inline mr-2"><input type="radio" value="Física" v-model="entity.tipoPessoa"> Física</label>
                <label class="radio-inline"><input type="radio" value="Jurídica" v-model="entity.tipoPessoa"> Jurídica</label>
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
            <div class="col-4">
                <label>Cidade</label>
                <div class="input-group">
                    <input id="cidade" type="text" class="form-control" v-model="cidadeSelecionada" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-cidade class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-2">
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
            <div class="col-3">  
                <label>Tipo Cliente</label>
                <select class="form-control" v-model="entity.tipoCliente">
                    <option selected>Selecione...</option>
                    <option value="Cliente">Cliente</option>
                    <option value="Sócio">Sócio</option>
                </select>
            </div>
            
            <div class="col-4">
                <label>Forma de Pagamento</label>
                <div class="input-group">
                    <input id="formaPagamento" type="text" class="form-control" v-model="formaSelecionada" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-formaPagamento class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div  v-if="entity.tipoCliente == 'Sócio'" class="row form-group">
            <div class="col-3">
                <label>Dependentes</label>
            </div>

            <div class="col-9 text-right">
                <b-button v-b-modal.modal-consulta-cidade class="btn btn-success btn-sm">Cadastrar Dependente</b-button>
            </div>
        </div>
        <div v-if="entity.tipoCliente == 'Sócio'" class="row">
            <div class="col-12">
                <vue-good-table
                    compactMode
                    :columns="dependentes.columns"
                    :rows="dependentes.rows"
                    :search-options="{enabled: false}"
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
                    <router-link :to="{name: 'ClientesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consulta-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>
        
        <b-modal id="modal-consulta-formaPagamento" size="xl" title="Consultar Forma de Pagamento" hide-footer>
            <ConsultaFormaPagamento @emit-forma="selectForma" />
        </b-modal>
    </div>
</template>

<script>
import {ClientesService} from '@/services/clientes.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import ConsultaFormaPagamento from '@/components/pages/formasPagamento/Consult.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ClientesEdit",
    components: { VueGoodTable, ConsultaCidade, ConsultaFormaPagamento },
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
                tipoCliente: "",
                codigoFormaPagamento: 0,
                dtCadastro: "",
                dtAlteracao: ""
            },
            cidadeSelecionada: "",
            formaSelecionada: "",
            dependentes: {
                columns: [
                    {
                        label: "Código",
                        field: "codigo",
                        type: "number"
                    },
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
        this.entity.codigo = this.$route.params.codigo;
        if(this.entity.codigo){
            ClientesService.getById(this.entity.codigo).then(function (data) {
                vm.entity = data.data;
                vm.cidadeSelecionada = data.data.cidade.cidade;
                vm.formaSelecionada = data.data.formaPagamento.descricao;
                vm.$delete(vm.entity, 'cidade');
                vm.$delete(vm.entity, 'formaPagamento');
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
        selectForma(entity) {
            this.formaSelecionada = entity.descricao;
            this.entity.codigoFormaPagamento = entity.codigo;
            this.$bvModal.hide("modal-new-formaPagamento");
            this.$bvModal.hide("modal-consulta-formaPagamento");
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
                    vm.$router.push('/clientes');
                }
            }); //.catch(function (errors) {Helper.saveErrorCallBack(errors.response)});
        }
    }
}
</script>