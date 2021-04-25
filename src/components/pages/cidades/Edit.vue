<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Cidade</h2>

        <div class="row">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="text" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Cidade</label> 
                <input id="cidade" type="text" class="form-control" v-model="entity.cidade"/>
            </div>

            <div class="col-2">
                <label>DDD</label>
                <input id="ddd" type="text" class="form-control" v-model="entity.ddd"/>
            </div>
            
            <div class="col-4">
                <label>Estado</label>
                <div class="input-group">
                    <input id="estado" type="text" class="form-control" v-model="estadoSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-estado class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="text-right mt-4">
            <router-link v-if="!isModal" :to="{name: 'CidadesList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
        </div>

        <b-modal id="modal-consulta-estado" size="xl" title="Consultar Estado" hide-footer>
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
    components: { 
        ConsultaEstado
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
                cidade: "",
                ddd: "",
                codigoEstado: 0
            },
            estadoSelecionado: "",
            estados: [],
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        this.entity.codigo = this.$route.params.codigo;
        if(this.entity.codigo){
            CidadesService.getById(this.entity.codigo).then(function (data) {
                vm.entity = data.data;

                EstadosService.getById(vm.entity.codigoEstado).then(function (data) {
                    vm.estadoSelecionado = data.data["estado"];
                });
            });
        }
    },
    methods: {
        selectEstado(entity) {
            this.estadoSelecionado = entity.estado;
            this.entity.codigoEstado = entity.codigo;
            this.$bvModal.hide("modal-new-estado");
            this.$bvModal.hide("modal-consulta-estado");
        },
        save() {
            if(this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            CidadesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Cidade " + msg + " com sucesso");
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit("emit-cidade", vm.entity);
                } else {
                    vm.$router.push('/cidades');
                }
            }).then(() => vm.isSubmiting = false);
            // .catch((errors) => Helper.saveErrorCallBack(errors.response))
        }
    }
}
</script>