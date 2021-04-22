<template>
    <div class="col-12">
        <h2>Cadastro de Clientes</h2>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="text" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Nome Completo</label>
                <input id="nome" type="text" class="form-control" v-model="entity.nome"/>
            </div>

            <div class="col-3">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline mr-2"><input type="radio" value="Feminino"> Feminino</label>
                <label class="radio-inline"><input type="radio" value="Masculino"> Masculino</label>
            </div>
            
            <div class="col-3">
                <label>Tipo Pessoa</label>
                <br/>
                <label class="radio-inline mr-2"><input type="radio" value="Feminino"> Física</label>
                <label class="radio-inline"><input type="radio" value="Masculino"> Jurídica</label>
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
                <input id="cpf_cnpj" type="text" class="form-control" v-model="entity.cpf_cnpj"/>
            </div>

            <div class="col-3">
                <label>RG / IE</label>
                <input id="rg_ie" type="text" class="form-control" v-model="entity.rg_ie"/>
            </div>

            <div class="col-3">
                <label>Data de Nascimento / Fundação</label>
                <input id="dataNasc" type="date" class="form-control" v-model="entity.dataNasc"/>
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
                        <b-button v-b-modal.modal-consulta-forma class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div  v-if="entity.tipoCliente == 'Sócio'" class="row">
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
                <input id="dataCadastro" type="text" class="form-control" v-model="entity.dataCadastro" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Alteração</label>
                <input id="dataAlteracao" type="text" class="form-control" v-model="entity.dataAlteracao" readonly/>
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
        
        <!-- <b-modal id="modal-new-cidade" size="xl" title="Cadastrar Cidade" hide-footer>
            <NovaCidade  @emit-cidade="selectCidade" :isModal="true" />
        </b-modal> -->
        
        <!-- <b-modal id="modal-consulta-estado" size="xl" title="Consultar Estado" hide-footer>
            <ConsultaEstado @emit-estado="selectEstado" />
        </b-modal>
        
        <b-modal id="modal-new-estado" size="xl" title="Cadastrar Estado" hide-footer>
            <NovoEstado  @emit-estado="selectEstado" :isModal="true" />
        </b-modal>

        <b-modal id="modal-consulta-pais" size="xl" title="Consultar País" hide-footer>
            <ConsultaPais @emit-pais="selectPais" />
        </b-modal>
        
        <b-modal id="modal-new-pais" size="xl" title="Cadastrar País" hide-footer>
            <NovoPais  @emit-pais="selectPais" :isModal="true" />
        </b-modal> -->
    </div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';

import {ClientesService} from '@/services/clientes.service'
// import {EstadosService} from '@/services/estados.service'
import {CidadesService} from '@/services/cidades.service'
// import ConsultaPais from '@/components/pages/paises/Consult.vue'
// import NovoPais from '@/components/pages/paises/Edit.vue'
// import ConsultaEstado from '@/components/pages/estados/Consult.vue'
// import NovoEstado from '@/components/pages/estados/Edit.vue'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
// import NovaCidade from '@/components/pages/cidades/Edit.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    components: { 
        VueGoodTable, ConsultaCidade
    },// ConsultaEstado, NovoEstado, ConsultaPais, NovoPais, NovaCidade },
    data() {
        return {
            entity: {
                codigo: 0,
                nome: "",
                sexo: "",
                tipo: "",
                logradouro: "",
                complemento: "",
                bairro: "",
                cep: "",
                codigoCidade: 0,
                telefone: "",
                email: "",
                cpf_cnpj: "",
                rg_ie: "",
                dataNasc: "",
                tipoCliente: "",
                codigoForma: 0,
                dataCadastro: "",
                dataAlteracao: ""
            },
            cidadeSelecionada: "",
            cidades: [],
            formaSelecionada: "",
            formas: [],
            dependentes: {
                columns: [
                    {
                        label: "Código",
                        field: "codigo",
                        type: 'number'
                    },
                    {
                        label: "Nome",
                        field: "nome"
                    },
                    {
                        label: "CPF / CNPJ",
                        field: "cpf_cnpj"
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

                CidadesService.getById(vm.entity.codigoEstado).then(function (data) {
                    vm.cidadeSelecionada = data.data["cidade"];
                });

                // CidadesService.getById(vm.entity.codigoEstado).then(function (data) {
                //     vm.formaSelecionada = data.data["formaPagamento"];
                // });
            });
        }
    },
    methods: {
        selectPais(entity) {
            this.paisSelecionado = entity.pais;
            this.entity.codigoPais = entity.codigo;
            this.$bvModal.hide("modal-new-pais");
            this.$bvModal.hide("modal-consulta-pais");
        },
        selectEstado(entity) {
            this.estadoSelecionado = entity.estado;
            this.entity.codigoEstado = entity.codigo;
            this.$bvModal.hide("modal-new-estado");
            this.$bvModal.hide("modal-consulta-estado");
        },
        selectCidade(entity) {
            this.paisSelecionado = entity.cidade;
            this.entity.codigoPais = entity.codigo;
            this.$bvModal.hide("modal-new-cidade");
            this.$bvModal.hide("modal-consulta-cidade");
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            CidadesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Cidade " + msg + " com sucesso");
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-cidade", vm.entity);
                } else {
                    vm.$router.push('/cidades');
                }
            }).then(() => vm.isSubmiting = false);
            // .catch((errors) => Helper.saveErrorCallBack(errors.response))
        }
    }
}
</script>