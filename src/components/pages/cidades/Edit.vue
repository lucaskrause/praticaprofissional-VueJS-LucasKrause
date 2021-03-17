<template>
    <div class="col-12">
        <h2>Cadastro de Cidade</h2>

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
            <router-link :to="{name: 'CidadesList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
        </div>

        <b-modal id="modal-consulta-estado" size="xl" title="Consultar Estado" hide-footer>
            <ConsultaEstado @emit-estado="selectEstado" />
        </b-modal>
        
        <b-modal id="modal-new-estado" size="xl" title="Cadastrar Estado" hide-footer>
            <NovoEstado  @emit-estado="selectEstado" :isModal="true" />
        </b-modal>

        <b-modal id="modal-consulta-pais" size="xl" title="Consultar País" hide-footer>
            <ConsultaPais @emit-pais="selectPais" />
        </b-modal>
        
        <b-modal id="modal-new-pais" size="xl" title="Cadastrar País" hide-footer>
            <NovoPais  @emit-pais="selectPais" :isModal="true" />
        </b-modal>
    </div>
</template>

<script>
import {EstadosService} from '@/services/estados.service'
import {CidadesService} from '@/services/cidades.service'
import ConsultaPais from '@/components/pages/paises/Consult.vue'
import NovoPais from '@/components/pages/paises/Edit.vue'
import ConsultaEstado from '@/components/pages/estados/Consult.vue'
import NovoEstado from '@/components/pages/estados/Edit.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    components: { ConsultaPais, NovoPais, ConsultaEstado, NovoEstado },
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
        selectPais(entity) {
            this.paisSelecionado = entity.pais;
            this.entity.codigoPais = entity.codigo;
            this.$bvModal.hide("modal-new-pais");
            this.$bvModal.hide("modal-consulta-pais");
        },
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