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
                <label>Condição de Pagamento</label>
                <input id="valor" type="text" class="form-control" v-uppercase v-model.lazy="entity.descricao"/>
            </div>

            <div class="col-2">
                <label>Juros (%)</label>
                <input id="juros" type="number" class="form-control" v-model.number="entity.juros"/>
            </div>

            <div class="col-2">
                <label>Multa (%)</label>
                <input id="multa" type="number" class="form-control" v-model.number="entity.multa"/>
            </div>

            <div class="col-2">
                <label>Desconto (%)</label>
                <input id="desconto" type="number" class="form-control" v-model.number="entity.desconto"/>
            </div>

            <div class="col-2">
                <label>Total Parcelas</label>
                <input id="totalParcelas" type="number" class="form-control" v-model.number="entity.totalParcelas" disabled/>
            </div>
        </div>

        <div class="row">
            <div class="col-3">
                <label>Parcelas</label>
            </div>

            <div class="col-9 text-right">
                <b-button v-b-modal.modal-new-parcela class="btn btn-success btn-sm">Nova Parcela</b-button>
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
                <input id="dataCadastro" type="text" class="form-control" v-model="entity.dtCadastro" readonly/>
            </div>
            
            <div class="col-2">
                <label>Data de Alteração</label>
                <input id="dataAlteracao" type="text" class="form-control" v-model="entity.dtAlteracao" readonly/>
            </div>

            <div class="col-8">
                <div class="text-right">
                    <router-link v-if="!isModal" :to="{name: 'CondicoesPagamentoList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-new-parcela" size="xl" title="Cadastrar Parcela" hide-footer>
            <NovaParcela @emit-parcela="selectParcela" :isModal="true" :numeroParcela="numeroParcela" />
        </b-modal>

        <b-modal id="modal-edit-parcela" size="xl" title="Editar Parcela" hide-footer>
            <NovaParcela @emit-parcela="selectParcela" :isModal="true" :editParcela="this.parcelaToEdit" />
        </b-modal>
    </div>
</template>

<script>
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
    props: {
        isModal: {
            type: Boolean,
            default: false
        }
    },
    components: { VueGoodTable, NovaParcela },
    data() {
        return {
            entity: {
                codigo: 0,
                descricao: null,
                multa: null,
                juros: null,
                desconto: null,
                totalParcelas: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
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
                totalRecords: 0
            },
            parcelasDeletedas:[],
            numeroParcela: 1,
            parcelaToEdit: {},
            isEdit: false,
            indexEdit: -1,
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
                
                vm.entity.dtCadastro = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.entity.dtAlteracao = dateTimeAlt.date + " " + dateTimeAlt.hour;
                vm.parcelas.rows = vm.entity.parcelas;
                vm.numeroParcela += vm.entity.totalParcelas;
            });
        }
    },
    methods: {
        selectParcela(entity) {
            if (!this.isEdit) {
                this.parcelas.rows.push(entity);
                this.entity.totalParcelas = this.numeroParcela;
                this.numeroParcela++;
                this.$bvModal.hide("modal-new-parcela");
            } else {
                this.parcelas.rows[this.indexEdit] = entity;
                this.indexEdit = -1;
                this.isEdit = false;
                this.$bvModal.hide("modal-edit-parcela");
            }
        },
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            
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
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        },
        editParcela(prop) {
            this.parcelaToEdit = prop.row;
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