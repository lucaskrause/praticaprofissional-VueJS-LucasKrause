<template>
    <div class="col-12">
        <h2>Cadastro de Estado</h2>

        <div class="row">
            <div class="col-1">
                <label>Código</label> 
                <input id="codigo" type="text" class="form-control" :v-model="entity.codigo" readonly/>
            </div>

            <div class="col-5">
                <label>Estado</label> 
                <input id="estado" type="text" class="form-control" :v-model="entity.estado"/>
            </div>

            <div class="col-2">
                <label>UF</label>
                <input id="uf" type="text" class="form-control" :v-model="entity.uf"/>
            </div>

            <div class="col-4">
                <label>País</label>
                <select id="pais" class="form-control" :v-model="entity.codigoPais">
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
            entity: {
                codigo: 0,
                estado: "",
                uf: "",
                codigoPais: 0
            },
            paises: []
        }
    }
}
</script>