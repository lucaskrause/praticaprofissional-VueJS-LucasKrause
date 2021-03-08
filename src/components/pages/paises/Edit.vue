<template>
    <div class="col-12">
        <h2>Cadastro de País</h2>

        <div class="row">
            <div class="col-6">
                <label>País</label>
                <br/> 
                <input id="pais" type="text" class="form-control" :v-model="pais"/>
            </div>

            <div class="col-3">
                <label>Sigla</label>
                <br/>
                <input id="sigla" type="text" class="form-control" :v-model="sigla"/>
            </div>

            <div class="col-3">
                <label>DDI</label>
                <br/>
                <input id="ddi" type="text" class="form-control" :v-model="ddi"/>
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
            pais: "",
            sigla: "",
            ddi: ""
        }
    }
}
</script>