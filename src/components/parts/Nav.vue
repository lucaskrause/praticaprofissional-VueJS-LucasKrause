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
                            <li v-for="(group) in groups" :key="group.id">
                                <a href="#" @click.prevent="() => true" v-b-toggle="'accord-menu-'+group.id">
                                    {{ group.label }}
                                </a>
                                <b-collapse :id="'accord-menu-'+group.id" class="submenu">
                                    <ul>
                                        <li v-for="(item) in itens" :key="item.id">
                                            <router-link :to="mountRoute(group.label, item.route)">
                                                {{item.label}}
                                            </router-link>
                                        </li>
                                    </ul>
                                </b-collapse>
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
                {id: 1, label: "Países"},
                {id: 2, label: "Estados"},
                {id: 3, label: "Cidades"},
            ],
            itens: [
                {id: 1, label: "Listar", route: "List"},
                {id: 2, label: "Cadastrar", route: "Cad"},
            ]
        }
    },
    methods: {
        retiraAcentos(str) {
            var comAcento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
            var semAcento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
            
            for(let i=0; i<str.length; i++) {
                if(comAcento.includes(str[i])) {
                    for (let j=0; j < comAcento.length; j++) {
                        if(comAcento[j] == str[i]) {
                            str = str.replace(comAcento[j], semAcento[j]);
                        }
                    }
                }
            }
            return str;
        },     
        mountRoute(component, route) {
            var rota = this.retiraAcentos(component) + route;
            var nameRota = {name: rota}
            return nameRota;
        }
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