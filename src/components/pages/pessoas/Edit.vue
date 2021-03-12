<template>
    <div class="col-12">
        <h2>Cadastro de Pessoas</h2>

        <div class="row">
            <div class="col-1">
                <label>Código</label>
                <input id="codigo" type="text" class="form-control" :v-model="entity.codigo" readonly/>
            </div>

            <div class="col-6">
                <label>Nome Completo</label>
                <input id="nome" type="text" class="form-control" :v-model="entity.nome"/>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-4">
                <label>Logradouro</label>
                <input id="logradouro" type="text" class="form-control" :v-model="entity.logradouro"/>
            </div>

            <div class="col-2">
                <label>Complemento</label>
                <input id="complemento" type="text" class="form-control" :v-model="entity.complemento"/>
            </div>
            <div class="col-4">
                <label>Bairro</label>
                <input id="bairro" type="text" class="form-control" :v-model="entity.bairro"/>
            </div>

            <div class="col-2">
                <label>CEP</label>
                <input id="cep" type="text" class="form-control" :v-model="entity.cep"/>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-4">
                <label>Cidade</label>
                <select id="cidade" class="form-control" :v-model="entity.codigoCidade">
                    <option value="" selected>Selecione uma Cidade...</option>
                    <option v-for="item in cidades" :value="item.id" :if="estado == item.id ? selected : null" :key="item.id">{{ item.cidade }}</option>
                </select>
            </div>

            <div class="col-2">
                <label>Telefone</label>
                <input id="telefone" type="text" class="form-control" :v-model="entity.telefone"/>
            </div>

            <div class="col-4">
                <label>Email</label>
                <input id="email" type="text" class="form-control" :v-model="entity.email"/>
            </div>
        </div>

        <div class="row mt-1">
            <div class="col-3">
                <label>CPF / CNPJ</label>
                <input id="cpf_cnpj" type="text" class="form-control" :v-model="entity.cpf_cnpj"/>
            </div>

            <div class="col-3">
                <label>RG / IE</label>
                <input id="rg_ie" type="text" class="form-control" :v-model="entity.rg_ie"/>
            </div>

            <div class="col-3">
                <label>Data de Nascimento</label>
                <input id="dataNasc" type="date" class="form-control" :v-model="entity.dataNasc"/>
            </div>

            <div class="col-3">
                <label>Sexo</label>
                <br/>
                <label class="radio-inline mr-2"><input type="radio" value="Feminino">Feminino</label>
                <label class="radio-inline"><input type="radio" value="Masculino">Masculino</label>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-3">  
                <label>Tipo</label>
                <br/>
                <label class="radio-inline mr-2"><input type="radio" value="Sócio">Sócio</label>
                <label class="radio-inline"><input type="radio" value="Outros">Outros</label>
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
                nome: "",
                logradouro: "",
                complemento: "",
                bairro: "",
                cep: "",
                codigoCidade: 0,
                telefone: "",
                email: "",
                cpf_cnpj: "",
                rg_ie: "",
                dataNasc: "",
                sexo: "",
                tipo: ""
            },
            cidades: []
        }
    }
}
</script>