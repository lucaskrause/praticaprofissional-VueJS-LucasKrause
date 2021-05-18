<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de País</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>País</label>
                <input id="pais" type="text" class="form-control" v-model="entity.pais"/>
            </div>

            <div class="col-2">
                <label>Sigla</label>
                <input id="sigla" type="text" class="form-control" v-model="entity.sigla"/>
            </div>

            <div class="col-2">
                <label>DDI</label>
                <input id="ddi" type="text" class="form-control" v-model="entity.ddi"/>
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
                    <router-link v-if="!isModal" :to="{name: 'PaisesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {PaisesService} from '@/services/paises.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "PaisesEdit",
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
                pais: "",
                sigla: "",
                ddi: "",
                dtCadastro: "",
                dtAlteracao: "" 
            },
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;
        }
        if (this.entity.codigo) {
            PaisesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
            });
        }
    },
    methods: {
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            this.$delete(this.entity, 'dtCadastro');
            this.$delete(this.entity, 'dtAlteracao');
            const vm = this;
            PaisesService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("País " + msg + " com sucesso");
                vm.isSubmiting = false;
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-pais', vm.entity);
                } else {
                    vm.$router.push('/app/paises');
                }
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>