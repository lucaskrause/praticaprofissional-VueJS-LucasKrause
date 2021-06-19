<template>
    <div class="col-12">
        <h2 v-if="!isModal">Cadastro de Conta Bancaria</h2>
        <hr v-if="!isModal"/>
        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model.number="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Instituição</label>
                <input id="instituicao" type="text" class="form-control" v-uppercase v-model.lazy="entity.instituicao"/>
            </div>

            <div class="col-3">
                <label>Número do Banco</label>
                <input id="numeroBanco" type="text" class="form-control" v-uppercase v-model.lazy="entity.numeroBanco"/>
            </div>

            <div class="col-2">
                <label>Agência</label>
                <input id="agencia" type="text" class="form-control" v-uppercase v-model.lazy="entity.agencia"/>
            </div>

            <div class="col-2">
                <label>Conta</label>
                <input id="conta" type="text" class="form-control" v-uppercase v-model.lazy="entity.conta"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-2">
                <label>Saldo</label> 
                <input id="saldo" type="number" class="form-control" v-model.number="entity.saldo"/>
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
                    <router-link v-if="!isModal" :to="{name: 'ContasBancariasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ContasBancariasService} from '@/services/contasBancarias.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "ContasBancariasEdit",
    props: {
        isModal: {
            type: Boolean,
            default: false
        },
        codigoEmpresa: {
            default: 0
        }
    },
    data() {
        return {
            entity: {
                codigo: 0,
                instituicao: null,
                numeroBanco: null,
                agencia: null,
                conta: null,
                saldo: null,
                codigoEmpresa: 0,
                dtCadastro: null,
                dtAlteracap: null,
            },
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        if (!this.isModal && this.$route.params.codigo) {
            this.entity.codigo = this.$route.params.codigo;

            ContasBancariasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
            });
        }
    },
    methods: {
        save() {
            if(this.codigoEmpresa > 0) {
                this.entity.codigoEmpresa = this.codigoEmpresa;
                if (this.isSubmiting) return;
                this.isSubmiting = true;
                const vm = this;
                ContasBancariasService.save(this.entity).then(function (response) {
                    const msg = vm.entity.codigo ? "editado" : 'criado';
                    notyf.success("Conta Bancaria " + msg + " com sucesso");
                    vm.isSubmiting = false;

                    if(!vm.isModal){
                        vm.$router.push('/app/contasBancarias');
                    } else {
                        vm.entity.codigo = response.data.codigo;
                        vm.$emit('emit-contaBancaria', vm.entity);
                    }
                }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
            } else {
                this.$delete(this.entity, 'dtCadastro');
                this.$delete(this.entity, 'dtAlteracap');
                this.$emit('emit-contaBancaria', this.entity);
            }
        }
    }
}
</script>