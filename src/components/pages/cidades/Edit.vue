<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Cidade</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Cidade</label> 
                <input id="cidade" type="text" class="form-control" v-uppercase v-model.lazy="entity.cidade"/>
            </div>

            <div class="col-2">
                <label>DDD</label>
                <input id="ddd" type="text" class="form-control" v-uppercase v-model.lazy="entity.ddd"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigoEstado" type="number" class="form-control" v-model.number="entity.codigoEstado" @input="searchEstado"/>
            </div>
            
            <div class="col-4">
                <label>Estado</label>
                <div class="input-group">
                    <input id="estado" type="text" class="form-control" v-model.lazy="estadoSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-estado class="btn btn-info ml-1">Buscar</b-button>
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
                    <router-link v-if="!isModal" :to="{name: 'CidadesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-estado" size="xl" title="Consultar Estado" hide-footer>
            <ConsultaEstado @emit-estado="selectEstado" />
        </b-modal>
    </div>
</template>

<script>
import {EstadosService} from '@/services/estados.service'
import {CidadesService} from '@/services/cidades.service'
import ConsultaEstado from '@/components/pages/estados/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "CidadesEdit",
    components: { ConsultaEstado },
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
                cidade: null,
                ddd: null,
                codigoEstado: 0,
                dtCadastro: null,
                dtAlteracao: null
            },
            estadoSelecionado: null,
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
            
            CidadesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                vm.estadoSelecionado = response.data.estado.estado;
            });
        }
    },
    methods: {
        selectEstado(entity) {
            this.estadoSelecionado = entity.estado;
            this.entity.codigoEstado = entity.codigo;
            this.$bvModal.hide("modal-new-estado");
            this.$bvModal.hide("modal-consult-estado");
        },
        searchEstado() {
            var vm = this;
            if (vm.entity.codigoEstado > 0) {
                EstadosService.getById(vm.entity.codigoEstado).then(function (response) {
                    vm.estadoSelecionado = response.data.estado;
                }).catch(function() {
                    vm.entity.codigoEstado = 0;
                    vm.estadoSelecionado = null;
                    notyf.error("Estado não encontrado");
                });
            } else {
                vm.estadoSelecionado = null;
            }
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            CidadesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Cidade " + msg + " com sucesso");
                vm.isSubmiting = false;

                if(!vm.isModal){
                    vm.$router.push('/app/cidades');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-cidade", vm.entity);
                }
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>