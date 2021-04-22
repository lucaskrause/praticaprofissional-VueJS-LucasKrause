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
                {id: 1, label: "Cidades",  route: {name: "CidadesList"}},
                {id: 2, label: "Estados", route: {name: "EstadosList"}},
                {id: 3, label: "Países", route: {name: "PaisesList"}},
                {id: 4, label: "Clientes", route: {name: "ClientesList"}},
            ],
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