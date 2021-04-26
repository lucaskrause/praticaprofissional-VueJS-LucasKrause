import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import("@/components/Home");

const PaisesList = () => import("@/components/pages/paises/List");
const PaisesEdit = () => import("@/components/pages/paises/Edit");

const EstadoList = () => import("@/components/pages/estados/List");
const EstadoEdit = () => import("@/components/pages/estados/Edit");

const CidadeList = () => import("@/components/pages/cidades/List");
const CidadeEdit = () => import("@/components/pages/cidades/Edit");

const FormaPagamentoList = () => import("@/components/pages/formasPagamento/List");
const FormaPagamentoEdit = () => import("@/components/pages/formasPagamento/Edit");

const ClienteList = () => import("@/components/pages/clientes/List");
const ClienteEdit = () => import("@/components/pages/clientes/Edit");

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
            // PAÍSES
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
            {
                path: 'paises/editar/:codigo',
                name: 'PaisesEdit',
                component: PaisesEdit,
                meta: {
                    label: "Editar País"
                },
            },
            
            // ESTADOS
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
                    label: "Cadastro de Estado"
                },
            },
            {
                path: 'estados/editar/:codigo',
                name: 'EstadosEdit',
                component: EstadoEdit,
                meta: {
                    label: "Editar Estado"
                },
            },
            
            // CIDADES
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
                path: 'cidades/editar/:codigo',
                name: 'CidadesEdit',
                component: CidadeEdit,
                meta: {
                    label: "Editar Cidade"
                },
            },
            
            // FORMAS DE PAGAMENTO
            {
                path: 'formasPagamento',
                name: 'FormasPagamentoList',
                component: FormaPagamentoList,
                meta: {
                    label: "Lista de Formas de Pagamento"
                },
            },
            {
                path: 'formasPagamento/cadastrar',
                name: 'FormasPagamentoCad',
                component: FormaPagamentoEdit,
                meta: {
                    label: "Cadastro de Formas de Pagamento"
                },
            },
            {
                path: 'formasPagamento/editar/:codigo',
                name: 'FormasPagamentoEdit',
                component: FormaPagamentoEdit,
                meta: {
                    label: "Editar Forma de Pagamento"
                },
            },

            // CLIENTES
            {
                path: 'clientes',
                name: 'ClientesList',
                component: ClienteList,
                meta: {
                    label: "Lista de Clientes"
                },
            },
            {
                path: 'clientes/cadastrar',
                name: 'ClientesCad',
                component: ClienteEdit,
                meta: {
                    label: "Cadastro de Cliente"
                },
            },
            {
                path: 'clientes/editar/:codigo',
                name: 'ClientesEdit',
                component: ClienteEdit,
                meta: {
                    label: "Editar Cliente"
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