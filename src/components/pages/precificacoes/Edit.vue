<template>
    <div class="col-12">
        <h2>Cadastro de Preço</h2>
        <hr/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-2">
                <label>Mín de Pessoas</label>
                <input id="minPessoas" type="number" class="form-control" v-model.number="entity.minPessoas"/>
            </div>

            <div class="col-2">
                <label>Máx de Pessoas</label>
                <input id="maxPessoas" type="number" class="form-control" v-model.number="entity.maxPessoas"/>
            </div>

            <div class="col-2">
                <label>Valor</label>
                <input id="valor" type="number" class="form-control" v-model.number="entity.valor"/>
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
                    <router-link :to="{name: 'PrecificacoesList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {PrecificacoesService} from '@/services/precificacoes.service'
import Helper from '@/components/helper'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "PrecificacoesEdit",
    data() {
        return {
            entity: {
                codigo: 0,
                minPessoas: null,
                maxPessoas: null,
                valor: null,
                dtCadastro: null,
                dtAlteracao: null
            },
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;

            PrecificacoesService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;

                var dateTimeCad = Helper.serverDateToDateTimeString(vm.entity.dtCadastro);
                var dateTimeAlt = Helper.serverDateToDateTimeString(vm.entity.dtAlteracao);
                
                vm.entity.dtCadastro = dateTimeCad.date + " " + dateTimeCad.hour;
                vm.entity.dtAlteracao = dateTimeAlt.date + " " + dateTimeAlt.hour;
            });
        }
    },
    methods: {
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            PrecificacoesService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editado" : 'criado';
                notyf.success("Preço " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/app/precificacoes');
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>