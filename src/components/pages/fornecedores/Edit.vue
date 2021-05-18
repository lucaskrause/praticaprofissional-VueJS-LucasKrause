<template>
    <div class="col-12">
        <h2>Cadastro de Fornecedor</h2>
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
                    <router-link :to="{name: 'FornecedoresList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consulta-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>
    </div>
</template>

<script>
import {FornecedoresService} from '@/services/fornecedores.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "FornecedoresEdit",
    components: { ConsultaCidade },
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
                dtCadastro: "",
                dtAlteracao: ""
            },
            cidadeSelecionada: "",
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
        }
        if(this.entity.codigo){
            FornecedoresService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                vm.cidadeSelecionada = response.data.cidade.cidade;
                vm.$delete(vm.entity, 'cidade');
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
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            this.$delete(this.entity, 'dtCadastro');
            this.$delete(this.entity, 'dtAlteracao');
            const vm = this;
            FornecedoresService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Fornecedor " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/fornecedores');
            }); //.catch(function (errors) {Helper.saveErrorCallBack(errors.response)});
        }
    }
}
</script>