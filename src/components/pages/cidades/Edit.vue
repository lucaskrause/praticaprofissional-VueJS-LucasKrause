<template>
    <div class="col-12">
        <h2>Cadastro de Cidade</h2>

        <div class="row">
            <div class="col-1">
                <label>Cidade</label> 
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
                <select id="estado" class="form-control" v-model="entity.codigoEstado">
                    <option value="" selected>Selecione um Estado...</option>
                    <option v-for="item in estados" :value="item.id" :if="estado == item.id ? selected : null" :key="item.id">{{ item.estado }}</option>
                </select>
            </div>
        </div>

        <div class="text-right mt-4">
            <router-link :to="{name: 'CidadesList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <a class="btn btn-success">Salvar</a>
        </div>

        
    </div>
</template>

<script>
import {CidadesService} from '@/services/cidades.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    data() {
        return {
            entity: {
                codigo: 0,
                cidade: "",
                ddd: "",
                codigoEstado: 0
            },
            estados: []
        }
    },
    created() {
        const vm = this;
        this.entity.codigo = this.$route.params.codigo;
        if(this.entity.codigo){
            CidadesService.getById(this.entity.codigo).then(function (data) {
                vm.entity = data.data;
                notyf.success("roi");
            });
        }
    },
    methods: {

    }
}
</script>