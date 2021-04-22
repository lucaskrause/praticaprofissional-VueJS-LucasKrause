<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Estado</h2>

        <div class="row">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="text" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Estado</label> 
                <input id="estado" type="text" class="form-control" v-model="entity.estado"/>
            </div>

            <div class="col-2">
                <label>UF</label>
                <input id="uf" type="text" class="form-control" v-model="entity.uf"/>
            </div>

            <div class="col-4">
                <label>País</label>
                <div class="input-group">
                    <input id="pais" type="text" class="form-control" v-model="paisSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consulta-pais class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="text-right mt-4">
            <router-link v-if="!isModal" :to="{name: 'EstadosList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
        </div>

        <b-modal id="modal-consulta-pais" size="xl" title="Consultar País" hide-footer>
            <ConsultaPais @emit-pais="selectPais" />
        </b-modal>
        
        <b-modal id="modal-new-pais" size="xl" title="Cadastrar País" hide-footer>
            <NovoPais  @emit-pais="selectPais" :isModal="true" />
        </b-modal>
    </div>

</template>

<script>
import {PaisesService} from '@/services/paises.service'
import {EstadosService} from '@/services/estados.service'
import ConsultaPais from '@/components/pages/paises/Consult.vue'
import NovoPais from '@/components/pages/paises/Edit.vue'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    components: { ConsultaPais, NovoPais },
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
                codigoPais: 0
            },
            paisSelecionado: "",
            paises: [],
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        this.entity.codigo = this.$route.params.codigo;
        if(this.entity.codigo) {
            EstadosService.getById(this.entity.codigo).then(function (data) {
                vm.entity = data.data;
                
                PaisesService.getById(vm.entity.codigoPais).then(function (data) {
                    vm.paisSelecionado = data.data["pais"];
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
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            EstadosService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Estado " + msg + " com sucesso");
                if(vm.isModal) {
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-estado', vm.entity);
                } else {
                    vm.$router.push('/estados');
                }
            }).then(() => vm.isSubmiting = false);
            // .catch((errors) => Helper.saveErrorCallBack(errors.response))
        }
    }
}
</script>