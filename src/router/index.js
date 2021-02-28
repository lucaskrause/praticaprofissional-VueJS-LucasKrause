import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import("@/components/Home");

const CidadeList = () => import("@/components/pages/cidades/List");
const CidadeEdit = () => import("@/components/pages/cidades/Edit");

const EstadoList = () => import("@/components/pages/estados/List");
const EstadoEdit = () => import("@/components/pages/estados/Edit");

const PaisesList = () => import("@/components/pages/paises/List");
const PaisesEdit = () => import("@/components/pages/paises/Edit");

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            label: "Home"
        },
        children: [
            {
                path: 'cidades',
                name: 'CidadesList',
                component: CidadeList,
                meta: {
                    label: "Lista de Cidades"
                },
            },
            {
                path: 'cidades/cadastrar',
                name: 'CidadesCad',
                component: CidadeEdit,
                meta: {
                    label: "Cadastro de Cidade"
                },
            },
            {
                path: 'estados',
                name: 'EstadosList',
                component: EstadoList,
                meta: {
                    label: "Lista de Estados"
                },
            },
            {
                path: 'estados/cadastrar',
                name: 'EstadosCad',
                component: EstadoEdit,
                meta: {
                    label: "Cadastro de Cidade"
                },
            },
            {
                path: 'paises',
                name: 'PaisesList',
                component: PaisesList,
                meta: {
                    label: "Lista de Paises"
                },
            },
            {
                path: 'paises/cadastrar',
                name: 'PaisesCad',
                component: PaisesEdit,
                meta: {
                    label: "Cadastro de País"
                },
            },
        ]
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

export default router