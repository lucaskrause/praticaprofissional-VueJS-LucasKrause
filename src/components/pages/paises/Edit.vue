<template>
    <div class="col-12">
        <h2>Cadastro de País</h2>

        <div class="row">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="text" class="form-control" :v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>País</label>
                <input id="pais" type="text" class="form-control" :v-model="entity.pais"/>
            </div>

            <div class="col-2">
                <label>Sigla</label>
                <input id="sigla" type="text" class="form-control" :v-model="entity.sigla"/>
            </div>

            <div class="col-2">
                <label>DDI</label>
                <input id="ddi" type="text" class="form-control" :v-model="entity.ddi"/>
            </div>
        </div>

        <div class="text-right mt-4">
            <router-link :to="{name: 'PaisesList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <a class="btn btn-success">Salvar</a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            entity: {
                codigo: 0,
                pais: "",
                sigla: "",
                ddi: ""
            }
        }
    }
}
</script>