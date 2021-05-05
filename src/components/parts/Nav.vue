<template>
    <div class="custom-nav col-12 col-sm-4 col-lg-3 col-xl-2 col-lg-3 col-md-4">
        <div class="row">
            <div class="col-md-12 col-6 logo">
                <div class="row">
                    <div class="col-12 company-name">
                        <router-link :to="{name: 'Home'}">
                            <img src="./../../assets/logo.png" class="rounded-circle" style="backgroundColor: white;" alt="">
                        </router-link>
                        {{ NameCompany }}
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12 col-6 menu">
                        <ul>
                            <li v-for="group in groups" :key="group.id">
                                <router-link :to="group.route">
                                    {{group.label}}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    components: {  },
    data () {
        return {
            NameCompany: "CLUBE SINCOFOZ",
            groups: [
                // {id: 1, label: "Empresa",  route: null},
                // {id: 2, label: "Regiões", route: null},
                // {id: 3, label: "Pagamentos", route: null},
                // {id: 4, label: "Geral", route: null},
                {id: 1, label: "Empresas", route: {name: "EmpresasList"}},
                {id: 2, label: "Contas Bancarias", route: {name: "ContasBancariasList"}},
                {id: 3, label: "Funcionários", route: {name: "FuncionariosList"}},
                {id: 4, label: "Cotas", route: {name: "CotasList"}},
                {id: 5, label: "Clientes", route: {name: "ClientesList"}},
                {id: 6, label: "Dependentes", route: {name: "DependentesList"}},
                {id: 7, label: "Reservas", route: {name: "ReservasList"}},
                {id: 8, label: "Precificações", route: {name: "PrecificacoesList"}},
                {id: 9, label: "Formas de Pagamento", route: {name: "FormasPagamentoList"}},
                {id: 10, label: "Condições de Pagamento", route: {name: "CondicoesPagamentoList"}},
                {id: 11, label: "Países", route: {name: "PaisesList"}},
                {id: 12, label: "Estados", route: {name: "EstadosList"}},
                {id: 13, label: "Cidades",  route: {name: "CidadesList"}},
            ],
            // subGroups: [
            //     {id:, group: 1, label: "Empresa", route: {name: "EmpresasList"}}
            //     {id:, group: 1, label: "Conta Bancaria", route: {name: "ContaBancariaList"}}
            //     {id:, group: 1, label: "Funcionários", route: {name: "FuncionáriosList"}}
            //     {id:, group: 1, label: "Cotas", route: {name: "CotasList"}}
            //     {id:, group: 1, label: "Clientes", route: {name: "ClientesList"}}
            //     {id:, group: 1, label: "Dependentes", route: {name: "DependentesList"}}
            //     {id:, group: 1, label: "Reservas", route: {name: "ReservasList"}},
            //     {id:, group: 2, label: "Cidades",  route: {name: "CidadesList"}},
            //     {id:, group: 2, label: "Estados", route: {name: "EstadosList"}},
            //     {id:, group: 2, label: "Países", route: {name: "PaisesList"}},
            //     {id:, group: 3, label: "Formas de Pagamento", route: {name: "FormasPagamentoList"}},
            //     {id:, group: 3, label: "Condições de Pagamento", route: {name: "CondicoesPagamentoList"}},
            //     {id:, group: 3, label: "Preços para Reserva", route: {name: "PrecificacaoList"}}
            //     {id:, group: 4, label: "Fornecedores", route: {name: "FornecedoresList"}}
            //     {id:, group: 4, label: "Produtos", route: {name: "ProdutosList"}}
            //     {id:, group: 4, label: "Serviços", route: {name: "ServiçosList"}}
            //     {id:, group: 4, label: "Compras", route: {name: "ComprasList"}}
            // ]
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
.custom-nav {
    width: 220px;
    text-align: left;
    background-color: #2f4050;
    min-height: 100vh;
    padding: 0;
    overflow-y: hidden;
    overflow-x: hidden;
}

.logo {
    margin: 5px 10px;
}

img {
    max-width: 100%;
    max-width: 50px;
    height: auto;
}

.company-name {
    font-weight: bold;
    color: #fff;
    padding-top: 5px;
}

.menu {
    font-weight: bold;
    color: #fff;
}

ul {
    list-style: none;
    padding-left: 0;
    text-align: left;
}

li {
    position: relative;
    margin-bottom: 10px;
}

ul > li > a {
    color: #fff;
    text-decoration: none;
}

ul > li > a:link {
    color: #fff;
    text-decoration: none;
}

ul > li > a:visited {
    color: #fff;
    text-decoration: none;
}

ul > li > a:hover {
    color: #fff;
    text-decoration: none;
}

ul > li > a:active {
    color: #fff;
    text-decoration: none;
}

.submenu {
    margin-left: 30px;
}
</style>