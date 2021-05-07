<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Condição de Pagamento</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-3">
                <label>Condição de Pagamento</label>
                <input id="valor" type="text" class="form-control" v-model="entity.descricao"/>
            </div>

            <div class="col-2">
                <label>Juros (%)</label>
                <input id="juros" type="number" class="form-control" v-model="entity.juros"/>
            </div>

            <div class="col-2">
                <label>Multa (%)</label>
                <input id="multa" type="number" class="form-control" v-model="entity.multa"/>
            </div>

            <div class="col-2">
                <label>Desconto (%)</label>
                <input id="desconto" type="number" class="form-control" v-model="entity.desconto"/>
            </div>
        </div>

        <div class="row">
            <div class="col-3">
                <label>Parcelas</label>
            </div>

            <div class="col-9 text-right">
                <b-button v-b-modal.modal-consulta-cidade class="btn btn-success btn-sm">Nova Parcela</b-button>
            </div>
        </div>

        <div class="row mt-1">
            <div class="col-12">
                <vue-good-table
                    compactMode
                    :columns="parcelas.columns"
                    :rows="parcelas.rows"
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
                    <router-link v-if="!isModal" :to="{name: 'CondicoesPagamentoList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {CondicoesPagamentoService} from '@/services/condicoesPagamento.service'
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
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
    components: { VueGoodTable },
    data() {
        return {
            entity: {
                codigo: 0,
                descricao: "",
                multa: "",
                juros: "",
                desconto: "",
                dtCadastro: "",
                dtAlteracao: ""
            },
            parcelas: {
                columns: [
                    {
                        label: "Dia",
                        field: "dia"
                    },
                    {
                        label: "Porcentagem (%)",
                        field: "porcentagem"
                    },
                    {
                        label: "Forma de Pagamento",
                        field: "formaPagamento"
                    },
                    {
                        label: "Ações",
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
        this.entity.codigo = this.$route.params.codigo;
        if (this.entity.codigo) {
            CondicoesPagamentoService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
            });
        }
    },
    methods: {
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            CondicoesPagamentoService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Preço " + msg + " com sucesso");
                vm.isSubmiting = false;
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-preco', vm.entity);
                } else {
                    vm.$router.push('/condicoesPagamento');
                }
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>