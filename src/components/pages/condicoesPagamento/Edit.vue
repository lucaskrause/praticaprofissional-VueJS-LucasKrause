<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Condição de Pagamento</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-3">
                <label>Condição de Pagamento</label><span class="isRequired"> *</span>
                <input id="descricao" type="text" class="form-control" v-uppercase v-model.lazy="entity.descricao"
                    :class="{'is-invalid': $v.entity.descricao.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.descricao.required">
                    Condição de Pagamento obrigatório
                </div>
            </div>

            <div class="col-2">
                <label>Juros (%)</label><span class="isRequired"> *</span>
                <input id="juros" type="number" class="form-control" v-model.number="entity.juros"
                    :class="{'is-invalid': $v.entity.juros.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.juros.required">
                    Juros obrigatório
                </div>
            </div>

            <div class="col-2">
                <label>Multa (%)</label><span class="isRequired"> *</span>
                <input id="multa" type="number" class="form-control" v-model.number="entity.multa"
                    :class="{'is-invalid': $v.entity.multa.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.multa.required">
                    Multa obrigatório
                </div>
            </div>

            <div class="col-2">
                <label>Desconto (%)</label><span class="isRequired"> *</span>
                <input id="desconto" type="number" class="form-control" v-model.number="entity.desconto"
                    :class="{'is-invalid': $v.entity.desconto.$error}"/>
                <div class="invalid-feedback" v-if="!$v.entity.desconto.required">
                    Desconto obrigatório
                </div>
            </div>

            <div class="col-2">
                <label>Total Parcelas</label>
                <input id="totalParcelas" type="number" class="form-control" v-model.number="entity.totalParcelas" disabled/>
            </div>
        </div>

        <div class="row">
            <div class="col-4">
                <label>Parcelas</label>
            </div>

            <div class="col-4">
                <small v-if="parcelas.porcentagem < 0" class="invalid">{{ parcelas.porcentagem }}%, remova parcelas ou altere-as</small>
                <small v-if="parcelas.porcentagem > 0" class="invalid">Está sobrando {{ parcelas.porcentagem }}%, adicione parcelas ou altere-as</small>
                <small v-if="parcelas.porcentagem == 0" class="valid">A(s) parcela(s) atingiu(ram) 100%</small>
            </div>

            <div class="col-4 text-right">
                <b-button v-b-modal.modal-new-parcela class="btn btn-success btn-sm" :disabled="parcelas.porcentagem <= 0">Nova Parcela</b-button>
            </div>
        </div>

        <div class="row mt-1">
            <div class="col-12">
                <vue-good-table compactMode
                    :columns="parcelas.columns"
                    :rows="parcelas.rows"
                    :search-options="{enabled: false}"
                    :pagination-options="{perPage: 12, enabled: false}"
                    styleClass="vgt-table bordered vgt-compact condensed"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'btn'">
                            <a @click.prevent="editParcela(props)" class="btn btn-sm btn-primary mr-3" href="#">Editar</a>
                            <a @click.prevent="removeParcela(props)" class="btn btn-sm btn-danger" href="#">Excluir</a>
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
                    <router-link v-if="!isModal" :to="{name: 'CondicoesPagamentoList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-new-parcela" size="xl" title="Cadastrar Parcela" hide-footer>
            <NovaParcela @emit-parcela="selectParcela" :isModal="true" :numeroParcela="numeroParcela" :porcentagem="parseFloat(this.parcelas.porcentagem)" />
        </b-modal>

        <b-modal id="modal-edit-parcela" size="xl" title="Editar Parcela" hide-footer>
            <NovaParcela @emit-parcela="selectParcela" :isModal="true" :editParcela="this.parcelaToEdit"  :porcentagem="parseFloat(this.parcelas.porcentagem)"/>
        </b-modal>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import NovaParcela from '@/components/pages/condicaoParcelas/Edit'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
import Helper from '@/components/helper'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "CondicoesPagamentosEdit",
    components: { VueGoodTable, NovaParcela },
    props: {
        isModal: {
            type: Boolean,
            default: false
        }
    },
    mixins: [validationMixin],
    validations() {
        let validation = {
            entity: {
                descricao: {
                    required,
                },
                juros: {
                    required,
                },
                multa: {
                    required,
                },
                desconto: {
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
                descricao: null,
                juros: 0,
                multa: 0,
                desconto: 0,
                totalParcelas: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
            dtCad: null,
            dtAlt: null,
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
                    },
                    {
                        label: "Ações",
                        field: "btn",
                        html: true,
                        sortable: false,
                        width: "170px"
                    }
                ],
                rows: [],
                page: 1,
                totalRecords: 0,
                porcentagem: 100
            },
            parcelasDeletedas:[],
            numeroParcela: 1,
            parcelaToEdit: {},
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
            
            CondicoesPagamentoService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);
                
                vm.dtCad = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.dtAlt = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.numeroParcela += vm.entity.totalParcelas;
                vm.parcelas.rows = vm.entity.parcelas;

                for (let i=0; i < vm.parcelas.rows.length; i++) {
                    vm.parcelas.porcentagem = (parseFloat(vm.parcelas.porcentagem) - parseFloat(vm.parcelas.rows[i].porcentagem)).toFixed(4);
                }
            });
        }
    },
    methods: {
        selectParcela(entity) {
            if (!this.isEdit) {
                this.parcelas.porcentagem = (parseFloat(this.parcelas.porcentagem) - parseFloat(entity.porcentagem)).toFixed(4);
                
                this.parcelas.rows.push(entity);
                this.entity.totalParcelas = this.numeroParcela;
                this.numeroParcela++;
                this.$bvModal.hide("modal-new-parcela");
            } else {
                this.parcelas.porcentagem = (parseFloat(this.parcelas.porcentagem) - parseFloat(entity.porcentagem)).toFixed(4);

                this.parcelas.rows[this.indexEdit] = entity;
                this.indexEdit = -1;
                this.isEdit = false;
                this.$bvModal.hide("modal-edit-parcela");
            }
        },
        save() {
            if (this.isSubmiting || this.isLoading) return;
            this.isSubmiting = true;
            this.$v.$touch();
            const vm = this;

            if (this.$v.$invalid) {
                this.isSubmiting = false;
                return;
            }
            if (this.parcelas.porcentagem > 0) {
                notyf.error("Parcelas incorretas, está sobrando " + this.parcelas.porcentagem + "%");
                this.isSubmiting = false;
                return;
            }
            if (this.parcelas.porcentagem < 0) {
                notyf.error("Parcelas incorretas, retire " + this.parcelas.porcentagem + "%");
                this.isSubmiting = false;
                return;
            }

            this.entity.parcelas = this.clearParcelas(this.parcelas.rows.concat(this.parcelasDeletedas));
            CondicoesPagamentoService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Condição de Pagamento " + msg + " com sucesso");
                vm.isSubmiting = false;
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-condicao', vm.entity);
                } else {
                    vm.$router.push('/app/condicoesPagamento');
                }
            }).catch(function (errors){
                notyf.error(errors.response.data.message);
                vm.isSubmiting = false;
            });
        },
        editParcela(prop) {
            this.parcelaToEdit = prop.row;
            this.parcelas.porcentagem = (parseFloat(this.parcelas.porcentagem) + parseFloat(this.parcelaToEdit.porcentagem)).toFixed(4);
            this.isEdit = true;
            this.indexEdit = prop.index;
            this.$bvModal.show("modal-edit-parcela");
        },
        orderParcela(index) {
            for (var i = index; i < this.parcelas.rows.length; i++) {
                this.parcelas.rows[i].numeroParcela--;
            }
        },
        removeParcela(entity) {
            if (this.parcelas.rows[entity.index].codigo > 0) {
                this.parcelas.rows[entity.index].status = "Inativo";
                this.parcelasDeletedas.push(this.parcelas.rows[entity.index]);
            }
            this.parcelas.porcentagem = (parseFloat(this.parcelas.porcentagem) + parseFloat(this.parcelas.rows[entity.index].porcentagem)).toFixed(4);

            this.parcelas.rows.splice(entity.index, 1);
            this.orderParcela(entity.index);
            this.entity.totalParcelas--;
            this.numeroParcela--;
        },
        clearParcelas(parcelas) {
            if (parcelas.length > 0) {
                for (let i = 0; i < parcelas.length; i++) {
                    var parcela = parcelas[i];
                    this.$delete(parcela, 'dtCadastro');
                    this.$delete(parcela, 'dtAlteracao');
                    parcelas[i] = parcela;
                }
            }
            return parcelas;
        }
    }
}
</script>

<style scoped>
.invalid{
    color: red
}
.valid{
    color: green
}
</style>