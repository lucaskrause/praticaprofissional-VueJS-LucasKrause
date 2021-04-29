<template>
    <div class="col-12">
        <h2>Reservar</h2>

        <div class="row form-group">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="number" class="form-control" v-model="entity.codigo" readonly/>
            </div>

            <div class="col-4">
                <label>Cliente</label>
                <div class="input-group">
                    <input id="cliente" type="text" class="form-control" v-model="clienteSelecionado" readonly/>
                    <span class="input-group-btn">
                        <b-button v-b-modal.modal-consult-cliente class="btn btn-info ml-1">Buscar</b-button>
                    </span>
                </div>
            </div>

            <div class="col-3 form-group">
                <label>Quantidade de Pessoas</label>
                <input id="qtdePessoas" type="number" class="form-control" v-model="entity.qtdePessoas"/>
            </div>

            <div class="col-3">
                <label>Data da Reserva</label>
                <input id="dtReserva" type="date" class="form-control" v-model="entity.dtReserva"/>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-3">
                <label>Tipo</label>
                <select class="form-control" v-model="entity.tipo">
                    <option selected>Selecione...</option>
                    <option value="Campo">Campo</option>
                    <option value="Sede Social">Sede Social</option>
                    <option value="Sede Social + Campo">Sede Social + Campo</option>
                </select>
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
                    <router-link :to="{name: 'ReservasList'}" class="btn btn-danger mr-3">Voltar</router-link>
                    <input type="submit" value="Salvar" class="btn btn-success" @click.prevent="save()" :class="{'disabled': isSubmiting}">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ReservasService} from '@/services/reservas.service'
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
    name: "CotasEdit",
    data() {
        return {
            entity: {
                codigo: 0,
                codigoCliente: "",
                qtdePessoas: "",
                dtReserva: "",
                tipo: "",
                dtCadastro: "",
                dtAlteracao: ""
            },
            clienteSelecionada: "",
            isSubmiting: false
        }
    },
    created() {
        const vm = this;
        this.entity.codigo = this.$route.params.codigo;
        if (this.entity.codigo) {
            ReservasService.getById(this.entity.codigo).then(function (response) {
                vm.entity = response.data;
            });
        }
    },
    methods: {
        save() {
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            const vm = this;
            ReservasService.save(this.entity).then(function () {
                const msg = vm.entity.codigo ? "editada" : 'criada';
                notyf.success("Reserva " + msg + " com sucesso");
                vm.isSubmiting = false;
                vm.$router.push('/reservas');
            }); // .catch((errors) => Helper.saveErrorCallBack(errors.response));
        }
    }
}
</script>