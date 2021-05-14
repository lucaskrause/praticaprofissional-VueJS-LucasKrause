<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de País</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-2">
                <label>Numero de Dias</label>
                <input id="dias" type="number" class="form-control" v-model="entity.dias"/>
            </div>

            <div class="col-2">
                <label>Porcentagem (%)</label>
                <input id="porcentagem" type="number" class="form-control" v-model="entity.porcentagem"/>
            </div>

            <div class="col-1">
                <label>Código</label>
                <input id="codigoFormaPagamento" type="number" class="form-control" v-model="entity.codigoFormaPagamento" readonly/>
            </div>
            
            <div class="col-4">
                <label>Forma de Pagamento</label>
                <div class="input-group">
                    <input id="formaPagamento" type="text" class="form-control" v-model="formaSelecionada" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-formaPagamento class="btn btn-info ml-1">Buscar</b-button>
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
        
        <b-modal id="modal-consulta-formaPagamento" size="xl" title="Consultar Forma de Pagamento" hide-footer>
            <ConsultaFormaPagamento @emit-forma="selectForma" />
        </b-modal>
    </div>
</template>

<script>
import {ParcelasService} from '@/services/parcelas.service'
import ConsultaFormaPagamento from '@/components/pages/formasPagamento/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ParcelasEdit",
    props: {
        isModal: {
            type: Boolean,
            default: false
        }
    },
    components: { ConsultaFormaPagamento },
    data() {
        return {
            entity: {
                codigo: 0,
                dias: "",
                porcentagem: "",
                codigoFormaPagamento: 0
            },
            formaSelecionada: "",
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
        }
        if (this.entity.codigo) {
            ParcelasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
            });
        }
    },
    methods: {
        selectForma(entity) {
            this.formaSelecionada = entity.descricao;
            this.entity.codigoFormaPagamento = entity.codigo;
            this.$bvModal.hide("modal-new-formaPagamento");
            this.$bvModal.hide("modal-consulta-formaPagamento");
        },
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            ParcelasService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("País " + msg + " com sucesso");
                vm.isSubmiting = false;
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-pais', vm.entity);
                } else {
                    vm.$router.push('/parcelas');
                }
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>