<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de País</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-2">
                <label>Numero de Dias</label>
                <input id="numeroDias" type="number" class="form-control" v-model.number="entity.numeroDias"/>
            </div>

            <div class="col-2">
                <label>Porcentagem (%)</label>
                <input id="porcentagem" type="number" class="form-control" v-model.number="entity.porcentagem"/>
            </div>

            <div class="col-1">
                <label>Código</label>
                <input id="codigoFormaPagamento" type="number" class="form-control" v-model.number="entity.formaPagamento.codigo" readonly/>
            </div>
            
            <div class="col-4">
                <label>Forma de Pagamento</label>
                <div class="input-group">
                    <input id="formaPagamento" type="text" class="form-control" v-uppercase v-model.lazy="entity.formaPagamento.descricao" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-formaPagamento class="btn btn-info ml-1">Buscar</b-button>
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
                    <router-link v-if="!isModal" :to="{name: 'ParcelasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
        
        <b-modal id="modal-consult-formaPagamento" size="xl" title="Consultar Forma de Pagamento" hide-footer>
            <ConsultaFormaPagamento @emit-forma="selectForma" />
        </b-modal>
    </div>
</template>

<script>
import ConsultaFormaPagamento from '@/components/pages/formasPagamento/Consult.vue'

export default {
    name: "ParcelasEdit",
    props: {
        isModal: {
            type: Boolean,
            default: false
        },
        numeroParcela: {
            type: Number,
            default: 0
        },
        editParcela: {
            type: Object,
            default: null
        }
    },
    components: { ConsultaFormaPagamento },
    data() {
        return {
            entity: {
                codigo: 0,
                numeroParcela: 0,
                numeroDias: null,
                porcentagem: null,
                codigoFormaPagamento: null,
                formaPagamento: {
                    codigo: 0,
                    descricao: null
                }
            },
            isSubmiting: false
        }
    },
    created() {
        if (this.isModal) {
            if (this.numeroParcela > 0) {
                this.entity.numeroParcela = this.numeroParcela;
            } else {
                this.entity = this.editParcela;
            }
        }
    },
    methods: {
        selectForma(entity) {
            this.entity.formaPagamento.descricao = entity.descricao;
            this.entity.formaPagamento.codigo = entity.codigo;
            this.entity.codigoFormaPagamento = entity.codigo;
            this.$bvModal.hide("modal-new-formaPagamento");
            this.$bvModal.hide("modal-consult-formaPagamento");
        },
        save() {
            this.$emit('emit-parcela', this.entity);
        }
    }
}
</script>