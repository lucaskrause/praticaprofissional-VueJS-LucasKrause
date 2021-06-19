<template>
    <div class="col-12">
        <h2>Cadastro de Funcionários</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Funcionário</label>
                <input id="funcionario" type="text" class="form-control" v-uppercase v-model.lazy="entity.nome"/>
            </div>

            <div class="col-3">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Feminino" v-uppercase v-model.lazy="entity.sexo"> Feminino</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Masculino" v-uppercase v-model.lazy="entity.sexo"> Masculino</label>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-4">
                <label>Logradouro</label>
                <input id="logradouro" type="text" class="form-control" v-uppercase v-model.lazy="entity.logradouro"/>
            </div>

            <div class="col-2">
                <label>Complemento</label>
                <input id="complemento" type="text" class="form-control" v-uppercase v-model.lazy="entity.complemento"/>
            </div>
            <div class="col-4">
                <label>Bairro</label>
                <input id="bairro" type="text" class="form-control" v-uppercase v-model.lazy="entity.bairro"/>
            </div>

            <div class="col-2">
                <label>CEP</label>
                <input id="cep" type="text" class="form-control" v-uppercase v-model.lazy="entity.cep"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigoCidade" type="number" class="form-control" v-model.number="entity.codigoCidade" readonly/>
            </div>

            <div class="col-4">
                <label>Cidade</label>
                <div class="input-group">
                    <input id="cidade" type="text" class="form-control" v-uppercase v-model.lazy="cidadeSelecionada" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-cidade class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-3">
                <label>Telefone</label>
                <input id="telefone" type="text" class="form-control" v-uppercase v-model.lazy="entity.telefone"/>
            </div>

            <div class="col-4">
                <label>Email</label>
                <input id="email" type="text" class="form-control" v-uppercase v-model.lazy="entity.email"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-3">
                <label>CPF</label>
                <input id="cpf" type="text" class="form-control" v-uppercase v-model.lazy="entity.cpf"/>
            </div>

            <div class="col-3">
                <label>RG</label>
                <input id="rg" type="text" class="form-control" v-uppercase v-model.lazy="entity.rg"/>
            </div>

            <div class="col-3">
                <label>Data de Nascimento</label>
                <input id="dtNascimento" type="date" class="form-control" v-uppercase v-model.lazy="entity.dtNascimento"/>
            </div>
        </div>

        <div class="row form-group">            
            <div class="col-3">
                <label>Salário</label>
                <input id="salario" type="number" class="form-control" v-model.number="entity.salario"/>
            </div>

            <div class="col-3">
                <label>Data de Admissão</label>
                <input id="dtAdmissao" type="date" class="form-control" v-uppercase v-model.lazy="entity.dtAdmissao"/>
            </div>

            <div class="col-3">
                <label>Data de Demissão</label>
                <input id="dtDemissao" type="date" class="form-control" v-uppercase v-model.lazy="entity.dtDemissao"/>
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
                    <router-link :to="{name: 'FuncionariosList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consult-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>
    </div>
</template>

<script>
import {FuncionariosService} from '@/services/funcionarios.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "FuncionáriosEdit",
    components: { ConsultaCidade },
    data() {
        return {
            entity: {
                codigo: 0,
                nome: null,
                sexo: null,
                logradouro: null,
                complemento: null,
                bairro: null,
                cep: null,
                codigoCidade: 0,
                telefone: null,
                email: null,
                cpf: null,
                rg: null,
                dtNascimento: null,
                salario: null,
                dtAdmissao: null,
                dtDemissao: null,
                dtCadastro: null,
                dtAlteracao: null
            },
            cidadeSelecionada: null,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;

            FuncionariosService.getById(this.entity.codigo).then(function (response) {
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
            this.$bvModal.hide("modal-consult-cidade");
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            FuncionariosService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Funcionário " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/funcionarios');
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