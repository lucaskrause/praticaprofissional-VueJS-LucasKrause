<template>
    <div class="col-12">
        <h2>Cadastro de Cidade</h2>

        <div class="row">
            <div class="col-6">
                <label>Cidade</label>
                <br/> 
                <input id="cidade" type="text" class="form-control" :v-model="cidade"/>
            </div>

            <div class="col-3">
                <label>DDD</label>
                <br/>
                <input id="ddd" type="text" class="form-control" :v-model="ddd"/>
            </div>
        </div>

        <div class="row">
            <div class="col-3">
                <label>Estado</label>
                <br/>
                <select id="estado" class="form-control" :v-model="estado">
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
export default {
    data() {
        return {
            cidade: "",
            ddd: "",
            estado: "",
            estados: []
        }
    }
}
</script>