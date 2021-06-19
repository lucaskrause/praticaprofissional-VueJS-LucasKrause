<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Produto</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Produto</label> 
                <input id="produto" type="text" class="form-control" v-uppercase v-model.lazy="entity.produto"/>
            </div>

            <div class="col-2">
                <label>Unidades</label>
                <input id="unidades" type="number" class="form-control" v-model.number="entity.unidades"/>
            </div>

            <div class="col-2">
                <label>Valor de Custo</label>
                <input id="valorCusto" type="number" class="form-control" v-model.number="entity.valorCusto"/>
            </div>

            <div class="col-2">
                <label>Estoque</label>
                <input id="estoque" type="number" class="form-control" v-model.number="entity.estoque"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigoCategoria" type="number" class="form-control" v-model.number="entity.codigoCategoria" readonly/>
            </div>

            <div class="col-4">
                <label>Categoria</label>
                <div class="input-group">
                    <input id="categoria" type="text" class="form-control" v-model.lazy="categoriaSelecionada" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-categoria class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-3">
                <label>Data da última compra</label> 
                <input id="dtUltimaCompra" type="date" class="form-control" v-model="entity.dtUltimaCompra"/>
            </div>

            <div class="col-3">
                <label>Valor da última compra</label>
                <input id="valorUltimaCompra" type="number" class="form-control" v-model.number="entity.valorUltimaCompra"/>
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
                    <router-link v-if="!isModal" :to="{name: 'ProdutosList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-categoria" size="xl" title="Consultar Categoria" hide-footer>
            <ConsultaCategoria @emit-categoria="selectCategoria" />
        </b-modal>
    </div>
</template>

<script>
import {ProdutosService} from '@/services/produtos.service'
import ConsultaCategoria from '@/components/pages/categorias/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ProdutosEdit",
    components: { ConsultaCategoria },
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
                produto: null,
                unidades: 0,
                valorCusto: null,
                estoque: null,
                codigoCategoria: 0,
                dtUltimaCompra: null,
                valorUltimaCompra: null,
                dtCadastro: null,
                dtAlteracao: null
            },
            categoriaSelecionada: null,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;

            ProdutosService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                vm.categoriaSelecionada = response.data.categoria.descricao;
            });
        }
    },
    methods: {
        selectCategoria(entity) {
            this.categoriaSelecionada = entity.descricao;
            this.entity.codigoCategoria = entity.codigo;
            this.$bvModal.hide("modal-new-categoria");
            this.$bvModal.hide("modal-consult-categoria");
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            ProdutosService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Produto " + msg + " com sucesso");
                vm.isSubmiting = false;

                if(!vm.isModal){
                    vm.$router.push('/app/produtos');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-produto", vm.entity);
                }
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>