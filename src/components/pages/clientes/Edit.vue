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
                <label class="radio-inline labelRadio"><input type="radio" value="PF" v-model="entity.tipoPessoa" :disabled="entity.codigo > 0"> Pessoa Física</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="PJ" v-model="entity.tipoPessoa" :disabled="entity.codigo > 0"> Pessoa Jurídica</label>
            </div>

            <div class="col-5">
                <label>Cliente</label><span class="isRequired"> *</span>
                <input id="nome" type="text" class="form-control" v-uppercase v-model.lazy="entity.nome"
                    :class="{'is-invalid': $v.entity.nome.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.nome.required">
                    Cliente obrigatório
                </div>
            </div>

            <div class="col-2">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Masculino" v-model="entity.sexo"> Masculino</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="Feminino" v-model="entity.sexo"> Feminino</label>
            </div>

            <div class="col-2">
                <label>É sócio?</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="true" v-uppercase v-model.lazy="entity.isSocio" disabled> Sim</label>
                <br/>
                <label class="radio-inline labelRadio"><input type="radio" value="false" v-uppercase v-model.lazy="entity.isSocio" disabled> Não</label>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-4">
                <label>Logradouro</label><span class="isRequired"> *</span>
                <input id="logradouro" type="text" class="form-control" v-uppercase v-model.lazy="entity.logradouro"
                    :class="{'is-invalid': $v.entity.logradouro.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.logradouro.required">
                    Logradouro obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.logradouro.maxLength">
                    Logradouro deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>Complemento</label>
                <input id="complemento" type="text" class="form-control" v-uppercase v-model.lazy="entity.complemento"/>
            </div>

            <div class="col-4">
                <label>Bairro</label><span class="isRequired"> *</span>
                <input id="bairro" type="text" class="form-control" v-uppercase v-model.lazy="entity.bairro"
                    :class="{'is-invalid': $v.entity.bairro.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.bairro.required">
                    Bairro obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.bairro.maxLength">
                    Bairro deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-2">
                <label>CEP</label><span class="isRequired"> *</span>
                <the-mask id="cep" class="form-control" v-model="entity.cep"
                    mask="#####-###" :masked="true"
                    :class="{'is-invalid': $v.entity.cep.$error}"/>                    
                <div class="invalid-feedback" v-if="!$v.entity.cep.required">
                    CEP obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.cep.minLength || !$v.entity.cep.maxLength">
                    CEP inválido
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>Cidade</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCidade" type="number" class="form-control" v-model.number="entity.codigoCidade" @input="searchCidade"
                        :class="{'is-invalid': $v.entity.codigoCidade.$error}"/>
                    <div class="input-group-append">
                        <input id="cidade" type="text" class="form-control" v-uppercase v-model.lazy="cidadeSelecionada" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-cidade class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCidade.minValue">
                        Selecione uma Cidade
                    </div>
                </div>
            </div>

            <div class="col-3">
                <label>Telefone</label><span class="isRequired"> *</span>
                <the-mask id="telefone" class="form-control" v-model="entity.telefone"
                    :mask="['(##) ####-####', '(##) #####-####']" :masked="true"
                    :class="{'is-invalid': $v.entity.telefone.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.telefone.required">
                    Telefone obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.telefone.minLength || !$v.entity.telefone.maxLength">
                    Telefone inválido
                </div>
            </div>

            <div class="col-4">
                <label>Email</label><span class="isRequired"> *</span>
                <input id="email" type="text" class="form-control" v-uppercase v-model.lazy="entity.email"
                    :class="{'is-invalid': $v.entity.email.$error || emailInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.email.required">
                    Email obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.email.maxLength">
                    Email deve ter no máximo 50 caracteres
                </div>
                <div class="invalid-feedback" v-if="emailInvalid">
                    Email inválido
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-3">
                <label>{{ labels.cpfCnpj }}</label><span class="isRequired"> *</span>
                <the-mask id="cpfCnpj" class="form-control" v-model="entity.cpfCnpj"
                    :mask="['###.###.###-##', '##.###.###/####-##']" :masked="false"
                    :class="{'is-invalid': $v.entity.cpfCnpj.$error || cpfCnpjInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.cpfCnpj.required">
                    {{ labels.cpfCnpj }} obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.cpfCnpj.minLength || !$v.entity.cpfCnpj.maxLength || cpfCnpjInvalid">
                    {{ labels.cpfCnpj }} inválido
                </div>
            </div>

            <div class="col-3">
                <label>{{ labels.rgIe }}</label>
                <input id="rgIe" type="text" class="form-control" v-uppercase v-model.lazy="entity.rgIe"/>
            </div>

            <div class="col-3">
                <label>{{ labels.dtNascimento }}</label><span class="isRequired"> *</span>
                <input id="dtNascimento" type="date" class="form-control" v-model="entity.dtNascimento"
                    :class="{'is-invalid': $v.entity.dtNascimento.$error || dtInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtNascimento.required">
                    {{ labels.dtNascimento }} obrigatória
                </div>
                <div class="invalid-feedback" v-if="dtInvalid">
                    {{ dtError }}
                </div>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-5">
                <label>Condição de Pagamento</label><span class="isRequired"> *</span>
                <div class="input-group">
                    <input id="codigoCondicaoPagamento" type="number" class="form-control" v-model.number="entity.codigoCondicaoPagamento" @input="searchCondicao"
                        :class="{'is-invalid': $v.entity.codigoCondicaoPagamento.$error}"/>
                    <div class="input-group-append">
                        <input id="condicaoPagamento" type="text" class="form-control" v-uppercase v-model.lazy="condicaoSelecionada" readonly/>
                        <span class="input-group-btn">
                            <b-button v-b-modal.modal-consult-condicaoPagamento class="btn btn-info ml-1">Buscar</b-button>
                        </span>
                    </div>
                    <div class="invalid-feedback" v-if="!$v.entity.codigoCondicaoPagamento.minValue">
                        Selecione uma Condição de Pagamento
                    </div>
                </div>
            </div>
        </div>

        <div v-if="entity.isSocio == true" class="row">
            <div class="col-3">
                <label>Dependentes</label>
            </div>

            <div class="col-9 text-right">
                <b-button v-b-modal.modal-new-dependente class="btn btn-success btn-sm">Cadastrar Dependente</b-button>
            </div>
        </div>
        <div v-if="entity.isSocio == true" class="row mt-1">
            <div class="col-12">
                <vue-good-table compactMode
                    :columns="dependentes.columns"
                    :rows="dependentes.rows"
                    :search-options="{enabled: false, placeholder: 'Buscar'}"
                    :pagination-options="{perPage: 10, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <a @click.prevent="editDependente(props)" class="btn btn-sm btn-primary mr-3" href="#">Editar</a>
                            <a @click.prevent="removeDependente(props)" class="btn btn-sm btn-danger" href="#">Excluir</a>
                        </span>
                    </template>
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
                    <router-link v-if="!isModal" :to="{name: 'ClientesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consult-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>
        
        <b-modal id="modal-consult-condicaoPagamento" size="xl" title="Consultar Condição de Pagamento" hide-footer>
            <ConsultaCondicaoPagamento @emit-condicao="selectCondicao" />
        </b-modal>

        <b-modal id="modal-new-dependente" size="xl" title="Cadastrar Dependente" hide-footer>
            <NovoDependente @emit-dependente="selectDependente" :isModal="true" />
        </b-modal>
        
        <b-modal id="modal-edit-dependente" size="xl" title="Editar Dependente" hide-footer>
            <NovoDependente @emit-dependente="selectDependente" :isModal="true" :editDependente="this.dependenteToEdit" />
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, minValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import Helper from '@/components/helper'
import {CidadesService} from '@/services/cidades.service'
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import {ClientesService} from '@/services/clientes.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import ConsultaCondicaoPagamento from '@/components/pages/condicoesPagamento/Consult.vue'
import NovoDependente from '@/components/pages/dependentes/Edit.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf();

export default {
    name: "ClientesEdit",
    components: { TheMask, VueGoodTable, ConsultaCidade, ConsultaCondicaoPagamento, NovoDependente },
    props: {
        isModal: {
            type: Boolean,
            default: false
        },
        isCota: {
            type: Boolean,
            default: false
        }
    },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                 nome:  {
                    required,
                    maxLength: maxLength(50),
                },
                logradouro: {
                    required,
                    maxLength: maxLength(50),
                },
                bairro: {
                    required,
                    maxLength: maxLength(50),
                },
                cep: {
                    required,
                    minLength: minLength(9),
                    maxLength: maxLength(9),
                },
                codigoCidade: {
                    minValue: minValue(1),
                },
                telefone: {
                    required,
                    minLength: minLength(14),
                    maxLength: maxLength(15),
                },
                email: {
                    required,
                    maxLength: maxLength(50),
                },
                cpfCnpj: {
                    required,
                    minLength: minLength(11),
                    maxLength: maxLength(14),
                },
                dtNascimento: {
                    required,
                },
                codigoCondicaoPagamento:{
                    minValue: minValue(1),
                }
            }
        }
        return validation;
    },
    data() {
        return {
            labels: { cpfCnpj: "CPF", rgIe: "RG", dtNascimento: "Data de Nascimento" },
            entity: {
                codigo: 0,
                nome: null,
                sexo: "Masculino",
                tipoPessoa: "PF",
                logradouro: null,
                complemento: null,
                bairro: null,
                cep: null,
                codigoCidade: 0,
                telefone: null,
                email: null,
                cpfCnpj: null,
                rgIe: null,
                dtNascimento: null,
                codigoCondicaoPagamento: 0,
                dtCadastro: null,
                dtAlteracao: null,
                isSocio: false
            },
            cidadeSelecionada: null,
            condicaoSelecionada: null,
            dtCad: null,
            dtAlt: null,
            emailInvalid: false,
            cpfCnpjInvalid: false,
            dtInvalid: false,
            dtError: null,
            dependentes: {
                columns: [
                    {
                        label: "Código",
                        field: "codigo",
                        type: "number",
                        width: "100px",
                    },
                    {
                        label: "Nome",
                        field: "nome"
                    },
                    {
                        label: "CPF",
                        field: "cpf",
                        width: "150px",
                    },
                    {
                        label: "RG",
                        field: "rg",
                        width: "150px",
                    },
                    {
                        label: "Telefone",
                        field: "telefone",
                        width: "150px",
                    },
                    {
                        label: "Ação",
                        field: "btn",
                        sortable: false,
                        html: true,
                        width: "160px",
                    }
                ],
                rows: [],
                page: 1,
                totalRecords: 0
            },
            dependenteToEdit: {},
            dependenteRemovido: [],
            isEdit: false,
            indexEdit: -1,
            isLoading: false,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
            
            ClientesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateNascimento = Helper.dateToDateString(vm.entity.dtNascimento);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);

                vm.entity.dtNascimento = dateNascimento;
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.cidadeSelecionada = vm.entity.cidade.cidade;
                vm.condicaoSelecionada = vm.entity.condicaoPagamento.descricao;
                vm.dependentes.rows = vm.entity.dependentes ? vm.entity.dependentes : []; 
            });
        }
        
        if (this.isCota) {
            this.entity.isSocio = true;
        }
    },
    methods: {
        selectCidade(entity) {
            this.cidadeSelecionada = entity.cidade;
            this.entity.codigoCidade = entity.codigo;
            this.$bvModal.hide("modal-new-cidade");
            this.$bvModal.hide("modal-consult-cidade");
        },
        selectCondicao(entity) {
            this.condicaoSelecionada = entity.descricao;
            this.entity.codigoCondicaoPagamento = entity.codigo;
            this.$bvModal.hide("modal-new-condicaoPagamento");
            this.$bvModal.hide("modal-consult-condicaoPagamento");
        },
        selectDependente(entity) {
            if (!this.isEdit) {
                this.dependentes.rows.push(entity);
                this.$bvModal.hide("modal-new-dependente");
            } else {
                this.dependentes.rows[this.indexEdit] = entity;
                this.indexEdit = -1;
                this.isEdit = false;
                this.$bvModal.hide("modal-edit-dependente");
            }
        },
        searchCidade() {
            this.isLoading = true;
            var vm = this;
            if (vm.entity.codigoCidade > 0) {
                CidadesService.getById(vm.entity.codigoCidade).then(function (response) {
                    vm.cidadeSelecionada = response.data.cidade;
                    vm.isLoading = false;
                }).catch(function() {
                    vm.entity.codigoCidade = 0;
                    vm.cidadeSelecionada = null;
                    vm.isLoading = false;
                    notyf.error("Cidade não encontrada");
                });
            } else {
                vm.cidadeSelecionada = null;
                vm.isLoading = false;
            }
        },
        searchCondicao() {
            this.isLoading = true;
            var vm = this;
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
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.emailInvalid = false;
            this.cpfCnpjInvalid = false;
            this.dtInvalid = false;
            this.$v.$touch();
            const vm = this;

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }
            
            if (!Helper.validadorEmail(this.entity.email)) {
                vm.emailInvalid = true;
                document.getElementById('email').focus();
                vm.isSubmiting = false;
                return;
            }
            
            if (this.entity.tipoPessoa == "PF") {
                if(!Helper.validadorCPF(this.entity.cpfCnpj)) {
                    vm.cpfCnpjInvalid = true;
                    document.getElementById('cpfCnpj').focus();
                    vm.isSubmiting = false;
                    return;
                }
                
                if (Helper.calculaIdade(vm.entity.dtNascimento) < 18) {
                    vm.dtInvalid = true;
                    vm.dtError = "Idade deve ser no mínimo 18 anos";
                    document.getElementById('dtNascimento').focus();
                    vm.isSubmiting = false;
                    return;
                }
            } else {
                if (!Helper.validadorCNPJ(this.entity.cpfCnpj)) {
                    vm.cpfCnpjInvalid = true;
                    document.getElementById('cpfCnpj').focus();
                    vm.isSubmiting = false;
                    return;
                }

                var dateNow = Date.now();
                dateNow = Helper.dateToDateString(dateNow);
                if (vm.entity.dtFundacao > dateNow) {
                    vm.dtInvalid = true;
                    vm.dtError = vm.labels.dtdtNascFundacao + " deve ser no máximo a data de hoje";
                    document.getElementById('dtNascimento').focus();
                    vm.isSubmiting = false;
                    return;
                }
            }

            this.entity.dependentes = this.clearDependentes(this.dependentes.rows.concat(this.dependenteRemovido));
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
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        },
        editDependente(prop) {
            this.dependenteToEdit = prop.row;
            this.isEdit = true;
            this.indexEdit = prop.index;
            this.$bvModal.show("modal-edit-dependente");
        },
        removeDependente(entity) {
            if (entity.row.codigo > 0) {
                this.dependentes.rows[entity.index].status = "Inativo";
                this.dependenteRemovido.push(this.dependentes.rows[entity.index]);
            }
            this.dependentes.rows.splice(entity.index, 1);
        },
        clearDependentes(dependentes) {
            if (dependentes.length > 0) {
                for (let i = 0; i < dependentes.length; i++) {
                    var dependente = dependentes[i];
                    this.$delete(dependente, 'cliente');
                    this.$delete(dependente, 'cidade');
                    this.$delete(dependente, 'dtCadastro');
                    this.$delete(dependente, 'dtAlteracao');
                    dependentes[i] = dependente;
                }
            }
            return dependentes;
        }
    },
    watch: {
        'entity.tipoPessoa'(value) {
            if (value == "PF") {
                this.labels = { cpfCnpj: "CPF", rgIe: "RG", dtNascimento: "Data de Nascimento" };
            } else {
                this.labels = { cpfCnpj: "CNPJ", rgIe: "Inscrição Estadual", dtNascimento: "Data de Fundação" };
            }
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