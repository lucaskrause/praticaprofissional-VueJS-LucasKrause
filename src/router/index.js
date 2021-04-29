import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import("@/components/Home");

const PaisList = () => import("@/components/pages/paises/List");
const PaisEdit = () => import("@/components/pages/paises/Edit");

const EstadoList = () => import("@/components/pages/estados/List");
const EstadoEdit = () => import("@/components/pages/estados/Edit");

const CidadeList = () => import("@/components/pages/cidades/List");
const CidadeEdit = () => import("@/components/pages/cidades/Edit");

const CotaList = () => import("@/components/pages/cotas/List");
const CotaEdit = () => import("@/components/pages/cotas/Edit");

const ReservaList = () => import("@/components/pages/reservas/List");
const ReservaEdit = () => import("@/components/pages/reservas/Edit");

const FormaPagamentoList = () => import("@/components/pages/formasPagamento/List");
const FormaPagamentoEdit = () => import("@/components/pages/formasPagamento/Edit");

const CondicaoPagamentoList = () => import("@/components/pages/condicoesPagamento/List");
const CondicaoPagamentoEdit = () => import("@/components/pages/condicoesPagamento/Edit");

const ClienteList = () => import("@/components/pages/clientes/List");
const ClienteEdit = () => import("@/components/pages/clientes/Edit");

const PrecoList = () => import("@/components/pages/precificacoes/List");
const PrecoEdit = () => import("@/components/pages/precificacoes/Edit");

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
                component: PaisList,
                meta: {
                    label: "Lista de Paises"
                },
            },
            {
                path: 'paises/cadastrar',
                name: 'PaisesCad',
                component: PaisEdit,
                meta: {
                    label: "Cadastro de País"
                },
            },
            {
                path: 'paises/editar/:codigo',
                name: 'PaisesEdit',
                component: PaisEdit,
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
            
            // CONDIÇÕES DE PAGAMENTO
            {
                path: 'condicoesPagamento',
                name: 'CondicoesPagamentoList',
                component: CondicaoPagamentoList,
                meta: {
                    label: "Lista de Condicoes de Pagamento"
                },
            },
            {
                path: 'condicoesPagamento/cadastrar',
                name: 'CondicoesPagamentoCad',
                component: CondicaoPagamentoEdit,
                meta: {
                    label: "Cadastro de Condicoes de Pagamento"
                },
            },
            {
                path: 'condicoesPagamento/editar/:codigo',
                name: 'CondicoesPagamentoEdit',
                component: CondicaoPagamentoEdit,
                meta: {
                    label: "Editar Condição de Pagamento"
                },
            },
            
            // COTAS
            {
                path: 'cotas',
                name: 'CotasList',
                component: CotaList,
                meta: {
                    label: "Lista de Cotas"
                },
            },
            {
                path: 'cotas/cadastrar',
                name: 'CotasCad',
                component: CotaEdit,
                meta: {
                    label: "Cadastro de Cotas"
                },
            },
            {
                path: 'cotas/editar/:codigo',
                name: 'CotasEdit',
                component: CotaEdit,
                meta: {
                    label: "Editar Cota"
                },
            },
            
            // RESERVAS
            {
                path: 'reservas',
                name: 'ReservasList',
                component: ReservaList,
                meta: {
                    label: "Lista de Reservas"
                },
            },
            {
                path: 'reservas/cadastrar',
                name: 'ReservasCad',
                component: ReservaEdit,
                meta: {
                    label: "Reservar"
                },
            },
            {
                path: 'reservas/editar/:codigo',
                name: 'ReservasEdit',
                component: CotaEdit,
                meta: {
                    label: "Editar Reserva"
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
            
            // PRECIFICAÇÕES
            {
                path: 'precificacoes',
                name: 'PrecificacoesList',
                component: PrecoList,
                meta: {
                    label: "Lista de Preços"
                },
            },
            {
                path: 'precificacoes/cadastrar',
                name: 'PrecificacoesCad',
                component: PrecoEdit,
                meta: {
                    label: "Cadastro de Preço"
                },
            },
            {
                path: 'precificacoes/editar/:codigo',
                name: 'PrecificacoesEdit',
                component: PrecoEdit,
                meta: {
                    label: "Editar Preço"
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