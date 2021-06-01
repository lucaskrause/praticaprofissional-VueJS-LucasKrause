<template>
    <div class="col-12">
        <h2>Cadastro de Empresa</h2>
        <hr />
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Razão Social</label>
                <input id="razaoSocial" type="text" class="form-control" v-model="entity.razaoSocial"/>
            </div>

            <div class="col-5">
                <label>Nome Fantasia</label>
                <input id="nomeFantasia" type="text" class="form-control" v-model="entity.nomeFantasia"/>
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
                <label>CNPJ</label>
                <input id="cnpj" type="text" class="form-control" v-model="entity.cnpj"/>
            </div>

            <div class="col-3">
                <label>IE</label>
                <input id="ie" type="text" class="form-control" v-model="entity.ie"/>
            </div>

            <div class="col-3">
                <label>Data de Fundação</label>
                <input id="dtFundacao" type="date" class="form-control" v-model="entity.dtFundacao"/>
            </div>

            <div class="col-3">
                <label>Quantidade de Cotas</label>
                <input id="qtdeCotas" type="number" class="form-control" v-model.number="entity.qtdeCotas"/>
            </div>
        </div>

        <div class="row">
            <div class="col-3">
                <label>Contas Bancarias</label>
            </div>

            <div class="col-9 text-right">
                <b-button v-b-modal.modal-new-contaBancaria class="btn btn-success btn-sm">Cadastrar Conta Bancaria</b-button>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-12">
                <vue-good-table
                    compactMode
                    :columns="contasBancarias.columns"
                    :rows="contasBancarias.rows"
                    :search-options="{enabled: false}"
                    :pagination-options="{perPage: 5, enabled: true}"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <a @click.prevent="EditConta(props.row.codigo)" class="btn btn-sm btn-primary mr-3" href="#">Editar</a>
                            <a @click.prevent="removeConta(props.row.codigo)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
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
                    <router-link :to="{name: 'EmpresasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consulta-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>
        
        <b-modal id="modal-new-contaBancaria" size="xl" title="Cadastrar ContasBancaria" hide-footer>
            <NovaContaBancaria  @emit-contaBancaria="selectContaBancaria" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {EmpresasService} from '@/services/empresas.service'
import {ContasBancariasService} from '@/services/contasBancarias.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import NovaContaBancaria from '@/components/pages/contasBancarias/Edit.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "EmpresasEdit",
    components: { VueGoodTable, ConsultaCidade, NovaContaBancaria },
    data() {
        return {
            entity: {
                codigo: 0,
                razaoSocial: "",
                nomeFantasia: "",
                logradouro: "",
                complemento: "",
                bairro: "",
                cep: "",
                codigoCidade: 0,
                telefone: "",
                email: "",
                cnpj: "",
                ie: "",
                dtFundacao: "",
                qtdeCotas: 0,
                dtCadastro: "",
                dtAlteracao: ""
            },
            cidadeSelecionada: "",
            contasBancarias: {
                columns: [
                    {
                        label: "Código",
                        field: "codigo",
                        type: "number",
                        width: "100px",
                    },
                    {
                        label: "Banco",
                        field: "banco"
                    },
                    {
                        label: "Agência",
                        field: "agencia"
                    },
                    {
                        label: "Conta",
                        field: "conta"
                    },
                    {
                        label: "Número da Conta",
                        field: "numeroConta"
                    },
                    {
                        label: "Ação",
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
            
            EmpresasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                console.log(vm.entity);
                vm.cidadeSelecionada = response.data.cidade.cidade;
            });

            ContasBancariasService.getByEmpresa(this.entity.codigo).then(function (response) {
                vm.contasBancarias.rows.push(response.data);
            });
        }
    },
    methods: {
        selectContaBancaria(entity) {
            this.contasBancarias.rows.push(entity);
            this.$bvModal.hide("modal-new-contaBancaria");
            this.$bvModal.hide("modal-consulta-contaBancaria");
        },
        selectCidade(entity) {
            this.cidadeSelecionada = entity.cidade;
            this.entity.codigoCidade = entity.codigo;
            this.$bvModal.hide("modal-new-cidade");
            this.$bvModal.hide("modal-consulta-cidade");
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            EmpresasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Empresa " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/empresas');
            }); //.catch(function (errors) {Helper.saveErrorCallBack(errors.response)});
        }
    }
}
</script>