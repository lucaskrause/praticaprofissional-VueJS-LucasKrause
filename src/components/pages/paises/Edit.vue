<template>
    <div class="col-12">
        <h2>Cadastro de País</h2>

        <div class="row">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="text" class="form-control" v-model="entity.codigo" readonly/>
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

        <div class="text-right mt-4">
            <router-link :to="{name: 'PaisesList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
        </div>
    </div>
</template>

<script>
import {PaisesService} from '@/services/paises.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    data() {
        return {
            entity: {
                codigo: 0,
                pais: "",
                sigla: "",
                ddi: ""
            },
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        this.entity.codigo = this.$route.params.codigo;
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
            const vm = this;
            let service = PaisesService.save(this.entity);
            service.then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("País " + msg + " com sucesso");
                vm.$router.push('/paises');
            }).then(() => vm.isSubmiting = false);
            // .catch((errors) => Helper.saveErrorCallBack(errors.response))
            
        }
    }
}
</script>