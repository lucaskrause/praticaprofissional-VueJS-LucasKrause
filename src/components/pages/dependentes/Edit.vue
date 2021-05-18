<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Dependentes</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Dependente</label>
                <input id="dependente" type="text" class="form-control" v-model="entity.nome"/>
            </div>

            <div class="col-3">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline mr-2"><input type="radio" value="Feminino" v-model="entity.sexo"> Feminino</label>
                <label class="radio-inline"><input type="radio" value="Masculino" v-model="entity.sexo"> Masculino</label>
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
                        <b-button v-b-modal.modal-consulta-cidade-dependente class="btn btn-info ml-1">Buscar</b-button>
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
                <label>CPF</label>
                <input id="cpf" type="text" class="form-control" v-model="entity.cpf"/>
            </div>

            <div class="col-3">
                <label>RG</label>
                <input id="rg" type="text" class="form-control" v-model="entity.rg"/>
            </div>

            <div class="col-3">
                <label>Data de Nascimento</label>
                <input id="dtNascimento" type="date" class="form-control" v-model="entity.dtNascimento"/>
            </div>
        </div>

        <div v-if="!isModal" class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigoCliente" type="number" class="form-control" v-model="entity.codigoCliente" readonly/>
            </div>

            <div class="col-4">
                <label>Sócio</label>
                <div class="input-group">
                    <input id="cliente" type="text" class="form-control" v-model="socioSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-cliente class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
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
                    <router-link :to="{name: 'DependentesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consulta-cidade-dependente" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>

        <b-modal v-if="!isModal" id="modal-consulta-cliente" size="xl" title="Consultar Cliente" hide-footer>
            <ConsultaCliente @emit-cliente="selectCliente" />
        </b-modal>
    </div>
</template>

<script>
import {DependentesService} from '@/services/dependentes.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import ConsultaCliente from '@/components/pages/clientes/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "DependentesEdit",
    components: { ConsultaCidade, ConsultaCliente },
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
                logradouro: "",
                complemento: "",
                bairro: "",
                cep: "",
                codigoCidade: 0,
                telefone: "",
                email: "",
                cpf: "",
                rg: "",
                dtNascimento: "",
                codigoCliente: 0,
                dtCadastro: "",
                dtAlteracao: ""
            },
            cidadeSelecionada: "",
            socioSelecionado: "",
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
        }
        if(this.entity.codigo){
            DependentesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                vm.cidadeSelecionada = response.data.cidade.cidade;
                vm.socioSelecionado = response.data.cliente.nome;
                vm.$delete(vm.entity, 'cidade');
                vm.$delete(vm.entity, 'cliente');
            });
        }
    },
    methods: {
        selectCidade(entity) {
            this.cidadeSelecionada = entity.cidade;
            this.entity.codigoCidade = entity.codigo;
            this.$bvModal.hide("modal-new-cidade");
            this.$bvModal.hide("modal-consulta-cidade-dependente");
        },
        selectCliente(entity) {
            this.clienteSelecionado = entity.nome;
            this.entity.codigoCliente = entity.codigo;
            this.$bvModal.hide("modal-new-cliente");
            this.$bvModal.hide("modal-consulta-cliente");
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            this.$delete(this.entity, 'dtCadastro');
            this.$delete(this.entity, 'dtAlteracao');
            const vm = this;
            DependentesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Dependente " + msg + " com sucesso");
                vm.isSubmiting = false;
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-dependente", vm.entity);
                } else {
                    vm.$router.push('/app/dependentes');
                }
            }); //.catch(function (errors) {Helper.saveErrorCallBack(errors.response)});
        }
    }
}
</script>