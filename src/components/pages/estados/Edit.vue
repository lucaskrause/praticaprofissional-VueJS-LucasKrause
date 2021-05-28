<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Estado</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Estado</label> 
                <input id="estado" type="text" class="form-control" v-model="entity.estado"/>
            </div>

            <div class="col-2">
                <label>UF</label>
                <input id="uf" type="text" class="form-control" v-model="entity.uf"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigoPais" type="number" class="form-control" v-model="entity.codigoPais" readonly/>
            </div>

            <div class="col-4">
                <label>País</label>
                <div class="input-group">
                    <input id="pais" type="text" class="form-control" v-model="paisSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-pais class="btn btn-info ml-1">Buscar</b-button>
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
                    <router-link v-if="!isModal" :to="{name: 'EstadosList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>

        <b-modal id="modal-consult-pais" size="xl" title="Consultar País" hide-footer>
            <ConsultaPais @emit-pais="selectPais" />
        </b-modal>
    </div>

</template>

<script>
import {EstadosService} from '@/services/estados.service'
import ConsultaPais from '@/components/pages/paises/Consult.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "EstadosEdit",
    components: {
        ConsultaPais
    },
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
                estado: "",
                uf: "",
                codigoPais: 0,
                dtCadastro: "",
                dtAlteracao: ""
            },
            paisSelecionado: "",
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
        
            EstadosService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
                vm.paisSelecionado = response.data.pais.pais;
            });
        }
    },
    methods: {
        selectPais(entity) {
            this.paisSelecionado = entity.pais;
            this.entity.codigoPais = entity.codigo;
            this.$bvModal.hide("modal-new-pais");
            this.$bvModal.hide("modal-consult-pais");
        },
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            EstadosService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Estado " + msg + " com sucesso");
                vm.isSubmiting = false;
                
                if(!vm.isModal) {
                    vm.$router.push('/app/estados');
                } else {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-estado', vm.entity);
                }
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>