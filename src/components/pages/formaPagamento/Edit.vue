<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Forma de Pagamento</h2>

        <div class="row">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="text" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Forma de Pagamento</label>
                <input id="descricao" type="text" class="form-control" v-model="entity.descricao"/>
            </div>
        </div>

        <div class="text-right mt-4">
            <router-link v-if="!isModal" :to="{name: 'PaisesList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
        </div>
    </div>
</template>

<script>
import {FormaPagamentoService} from '@/services/formaPagamento.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
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
                descricao: ""
            },
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        this.entity.codigo = this.$route.params.codigo;
        if (this.entity.codigo) {
            FormaPagamentoService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
            });
        }
    },
    methods: {
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            FormaPagamentoService.save(this.entity).then(function (response) {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Forma de Pagamento " + msg + " com sucesso");
                if(vm.isModal){
                    vm.entity.codigo = response.data.codigo;
                    vm.$emit('emit-forma', vm.entity);
                } else {
                    vm.$router.push('/formaPagamento');
                }
            }).then(() => vm.isSubmiting = false);
            // .catch((errors) => Helper.saveErrorCallBack(errors.response))
            
        }
    }
}
</script>