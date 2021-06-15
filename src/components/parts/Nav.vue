<template>
    <div class="custom-nav col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2">
        <div class="row">
            <div class="col-md-12 col-6 logo">
                <div class="row">
                    <div class="col-12 company-name">
                        <router-link :to="{name: 'app'}" class="itemMenu">
                            <img src="./../../assets/logo.png" class="rounded-circle" style="backgroundColor: white;" alt="">
                            {{ NameCompany }}
                        </router-link>
                    </div>
                </div>
                <hr/>
                <div class="row">
                    <div class="col-md-12 col-6 menu">
                        <ul>
                            <li v-for="(group) in groups" :key="group.id">
                                <a href="#" class="itemMenu" @click.prevent="() => true" v-b-toggle="'accord-menu-'+group.id">
                                    <component :is="group.icon" font-scale="1.4"/>
                                    {{group.label}}
                                </a>
                                <b-collapse :id="'accord-menu-'+group.id" class="mt-3">
                                    <ul>
                                        <li v-for="item in getItemByCat(group.id)" :key="item.id">
                                            <router-link :to="item.route" class="itemMenu" @click="changePageTitle(item.name)">
                                                {{item.label}}
                                            </router-link>
                                        </li>
                                    </ul>
                                </b-collapse>
                                <hr>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {BIconBuilding, BIconCart3, BIconCreditCard, BIconGeoAlt} from 'bootstrap-vue'

export default {
    components: { BIconBuilding, BIconCart3, BIconCreditCard, BIconGeoAlt },
    data () {
        return {
            NameCompany: "CLUBE SINCOFOZ",
            groups: [
                {id: 1, label: "Empresas",  icon: "BIconBuilding"},
                {id: 2, label: "Geral", icon: "BIconCart3"},
                {id: 3, label: "Pagamentos", icon: "BIconCreditCard"},
                {id: 4, label: "Regiões", icon: "BIconGeoAlt"},
            ],
            itemsMenu: [
                {id: 1, group: 1, label: "Empresas", route: {name: "EmpresasList"}},
                // {id: 2, group: 1, label: "Contas Bancarias", route: {name: "ContasBancariasList"}},
                {id: 3, group: 1, label: "Funcionários", route: {name: "FuncionariosList"}},
                {id: 4, group: 1, label: "Cotas", route: {name: "CotasList"}},
                {id: 5, group: 1, label: "Clientes", route: {name: "ClientesList"}},
                {id: 6, group: 1, label: "Dependentes", route: {name: "DependentesList"}},
                {id: 7, group: 1, label: "Reservas", route: {name: "ReservasList"}},

                {id: 8, group: 2, label: "Fornecedores", route: {name: "FornecedoresList"}},
                {id: 9, group: 2, label: "Produtos", route: {name: "ProdutosList"}},
                {id: 10, group: 2, label: "Serviços", route: {name: "ServicosList"}},
                {id: 11, group: 2, label: "Areas de Locação", route: {name: "AreasLocacaoList"}},
                // {id: 11, group: 2, label: "Compras", route: {name: "ComprasList"}},

                {id: 12, group: 3, label: "Formas de Pagamento", route: {name: "FormasPagamentoList"}},
                {id: 13, group: 3, label: "Condições de Pagamento", route: {name: "CondicoesPagamentoList"}},
                {id: 14, group: 3, label: "Preços para Reserva", route: {name: "PrecificacoesList"}},

                {id: 15, group: 4, label: "Cidades",  route: {name: "CidadesList"}},
                {id: 16, group: 4, label: "Estados", route: {name: "EstadosList"}},
                {id: 17, group: 4, label: "Países", route: {name: "PaisesList"}},
            ],
        }
    },
    methods: {
        getItemByCat(group){
            return this.itemsMenu.filter((item) => item.group === group);
        },
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

.submenu {
    margin-left: 30px;
}

.itemMenu {
    color: #fff;
    text-decoration: none;
}
</style>