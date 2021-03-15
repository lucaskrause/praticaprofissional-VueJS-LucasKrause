<template>
    <div class="col-12">
        <h2>Cadastro de Estado</h2>

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
                    <input id="pais" type="text" class="form-control" v-model="paisSelecionado"/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-multi-1 class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>
        </div>

        <div class="text-right mt-4">
            <router-link :to="{name: 'EstadosList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
        </div>

        <b-modal id="modal-multi-1" size="xl" title="Buscar País" ok-only no-stacking>
            
        </b-modal>
    </div>
</template>

<script>
import {EstadosService} from '@/services/estados.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    data() {
        return {
            entity: {
                codigo: 0,
                estado: "",
                uf: "",
                codigoPais: 0
            },
            paisSelecionado: "Brasil",
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
                notyf.success("carregado com sucesso");
            });
        }
    },
    methods: {
        save() {
            
        }
    }
}
</script>