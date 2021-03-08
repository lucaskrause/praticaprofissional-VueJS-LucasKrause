<template>
    <div class="col-12">
        <h2>Cadastro de Estado</h2>

        <div class="row">
            <div class="col-6">
                <label>Estado</label>
                <br/> 
                <input id="estado" type="text" class="form-control" :v-model="estado"/>
            </div>

            <div class="col-3">
                <label>UF</label>
                <br/>
                <input id="uf" type="text" class="form-control" :v-model="uf"/>
            </div>
        </div>

        <div class="row">
            <div class="col-3">
                <label>País</label>
                <br/>
                <select id="pais" class="form-control" :v-model="pais">
                    <option value="" selected>Selecione um País...</option>
                    <option v-for="item in paises" :value="item.id" :if="pais == item.id ? selected : null" :key="item.id">{{ item.pais }}</option>
                </select>
            </div>
        </div>

        <div class="text-right mt-4">
            <router-link :to="{name: 'EstadosList'}" class="btn btn-danger mr-3">Voltar</router-link>
            <a class="btn btn-success">Salvar</a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            estado: "",
            uf: "",
            pais: "",
            paises: []
        }
    }
}
</script>