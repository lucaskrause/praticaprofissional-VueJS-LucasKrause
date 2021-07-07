<template>
    <div class="col-12">
        <h2>Cadastro de Empresa</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Razão Social</label><span class="isRequired"> *</span>
                <input id="razaoSocial" type="text" class="form-control" v-uppercase v-model.lazy="entity.razaoSocial"
                    :class="{'is-invalid': $v.entity.razaoSocial.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.razaoSocial.required">
                    Razão Social obrigatória
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.razaoSocial.maxLength">
                    Razão Social deve ter no máximo 50 caracteres
                </div>
            </div>

            <div class="col-5">
                <label>Nome Fantasia</label>
                <input id="nomeFantasia" type="text" class="form-control" v-uppercase v-model.lazy="entity.nomeFantasia"/>
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
                <label>CNPJ</label><span class="isRequired"> *</span>
                <the-mask id="cnpj" class="form-control" v-model="entity.cnpj"
                    mask="##.###.###/####-##" :masked="false"
                    :class="{'is-invalid': $v.entity.cnpj.$error || cnpjInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.cnpj.required">
                    CNPJ obrigatório
                </div>
                <div class="invalid-feedback" v-if="!$v.entity.cnpj.minLength || !$v.entity.cnpj.maxLength || cnpjInvalid">
                    CNPJ inválido
                </div>
            </div>

            <div class="col-3">
                <label>IE</label>
                <input id="ie" type="text" class="form-control" v-uppercase v-model.lazy="entity.ie"/>
            </div>

            <div class="col-3">
                <label>Data de Fundação</label><span class="isRequired"> *</span>
                <input id="dtFundacao" type="date" class="form-control" v-model="entity.dtFundacao"
                    :class="{'is-invalid': $v.entity.dtFundacao.$error || dtInvalid}"/>
                <div class="invalid-feedback" v-if="!$v.entity.dtFundacao.required">
                    Data de Fundação obrigatória
                </div>
                <div class="invalid-feedback" v-if="dtInvalid">
                    Data de Fundação deve ser no máximo a data de hoje
                </div>
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
                <vue-good-table compactMode
                    :columns="contasBancarias.columns"
                    :rows="contasBancarias.rows"
                    :search-options="{enabled: false, placeholder: 'Buscar'}"
                    :pagination-options="{perPage: 10, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <a @click.prevent="editContaBancaria(props)" class="btn btn-sm btn-primary mr-3" href="#">Editar</a>
                            <a @click.prevent="removeContaBancaria(props)" class="btn btn-sm btn-danger" href="#">Excluir</a>
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
                    <router-link :to="{name: 'EmpresasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consult-cidade" size="xl" title="Consultar Cidade" hide-footer>
            <ConsultaCidade @emit-cidade="selectCidade" />
        </b-modal>
        
        <b-modal id="modal-new-contaBancaria" size="xl" title="Cadastrar ContasBancaria" hide-footer>
            <NovaContaBancaria  @emit-contaBancaria="selectContaBancaria" :isModal="true" :codigoEmpresa="entity.codigo" />
        </b-modal>

        <b-modal id="modal-edit-contaBancaria" size="xl" title="Editar ContasBancaria" hide-footer>
            <NovaContaBancaria  @emit-contaBancaria="selectContaBancaria" :isModal="true" :editContaBancaria="this.contaBancariaToEdit" />
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, minValue} from 'vuelidate/lib/validators'
import {TheMask} from 'vue-the-mask'
import Helper from '@/components/helper'
import {CidadesService} from '@/services/cidades.service'
import {EmpresasService} from '@/services/empresas.service'
import ConsultaCidade from '@/components/pages/cidades/Consult.vue'
import NovaContaBancaria from '@/components/pages/contasBancarias/Edit.vue'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "EmpresasEdit",
    components: { TheMask, VueGoodTable, ConsultaCidade, NovaContaBancaria },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                razaoSocial:  {
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
                cnpj: {
                    required,
                    minLength: minLength(14),
                    maxLength: maxLength(14),
                },
                dtFundacao: {
                    required,
                },
            }
        }
        return validation;
    },
    data() {
        return {
            entity: {
                codigo: 0,
                razaoSocial: null,
                nomeFantasia: null,
                logradouro: null,
                complemento: null,
                bairro: null,
                cep: null,
                codigoCidade: 0,
                telefone: null,
                email: null,
                cnpj: null,
                ie: null,
                dtFundacao: null,
                qtdeCotas: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
            cidadeSelecionada: null,
            dtCad: null,
            dtAlt: null,
            emailInvalid: false,
            cnpjInvalid: false,
            dtInvalid: false,
            contasBancarias: {
                columns: [
                    {
                        label: "Código",
                        field: "codigo",
                        type: "number",
                        width: "100px",
                    },
                    {
                        label: "Instituição",
                        field: "instituicao"
                    },
                    {
                        label: "Número do Banco",
                        field: "numeroBanco",
                        width: "180px",
                    },
                    {
                        label: "Agência",
                        field: "agencia",
                        width: "150px",
                    },
                    {
                        label: "Conta",
                        field: "conta",
                        width: "150px",
                    },
                    {
                        label:"Ação",
                        sortable: false,
                        field: 'btn',
                        html: true,
                        width: "160px",
                    },
                ],
                rows: [],
                page: 1,
                totalRecords: 0
            },
            contaBancariaToEdit: {},
            contaBancariaRemovido: [],
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
            
            EmpresasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                
                var dateFundacao = Helper.dateToDateString(vm.entity.dtFundacao);
                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);
                
                vm.entity.dtFundacao = dateFundacao;
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.contasBancarias.rows = vm.entity.contasBancarias;
                vm.cidadeSelecionada = response.data.cidade.cidade;
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
        selectContaBancaria(entity) {
            if (!this.isEdit) {
                this.contasBancarias.rows.push(entity);
                this.$bvModal.hide("modal-new-contaBancaria");
            } else {
                this.contasBancarias.rows[this.indexEdit] = entity;
                this.indexEdit = -1;
                this.isEdit = false;
                this.$bvModal.hide("modal-edit-contaBancaria");
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
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.emailInvalid = false;
            this.cnpjInvalid = false;
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
            
            if (!Helper.validadorCNPJ(this.entity.cnpj)) {
                vm.cnpjInvalid = true;
                document.getElementById('cnpj').focus();
                vm.isSubmiting = false;
                return;
            }

            var dateNow = Date.now();
            dateNow = Helper.dateToDateString(dateNow);
            if (vm.entity.dtFundacao > dateNow) {
                vm.dtInvalid = true;
                document.getElementById('dtFundacao').focus();
                vm.isSubmiting = false;
                return;
            }

            var contasAux = vm.contasBancarias.rows;
            vm.contasBancarias.rows = vm.clearContasBancarias(vm.contasBancarias.rows.concat(vm.contaBancariaRemovido));
            vm.entity.contasBancarias = vm.contasBancarias.rows;
            EmpresasService.save(vm.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Empresa " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/empresas');
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.contasBancarias.rows = contasAux;
                vm.isSubmiting = false;
            });
        },
        editContaBancaria(prop) {
            this.contaBancariaToEdit = prop.row;
            this.isEdit = true;
            this.indexEdit = prop.index;
            this.$bvModal.show("modal-edit-contaBancaria");
        },
        removeContaBancaria(entity) {
            if (entity.row.codigo > 0) {
                this.contasBancarias.rows[entity.index].status = "Inativo";
                this.contaBancariaRemovido.push(this.contasBancarias.rows[entity.index]);
            }
            this.contasBancarias.rows.splice(entity.index, 1);
        },
        clearContasBancarias(contasBancarias) {
            if (contasBancarias.length > 0) {
                for (let i = 0; i < contasBancarias.length; i++) {
                    var contaBancaria = contasBancarias[i];
                    this.$delete(contaBancaria, 'dtCadastro');
                    this.$delete(contaBancaria, 'dtAlteracao');
                    contasBancarias[i] = contaBancaria;
                }
            }
            return contasBancarias;
        }
    }
}
</script>