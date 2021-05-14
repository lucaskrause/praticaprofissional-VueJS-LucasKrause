import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import("@/components/Home");

const Inicio = () => import("@/components/Inicio");

const EmpresaList = () => import("@/components/pages/empresas/List");
const EmpresaEdit = () => import("@/components/pages/empresas/Edit");

const ContaBancariaList = () => import("@/components/pages/contasBancarias/List");
const ContaBancariaEdit = () => import("@/components/pages/contasBancarias/Edit");

const FuncionarioList = () => import("@/components/pages/funcionarios/List");
const FuncionarioEdit = () => import("@/components/pages/funcionarios/Edit");

const CotaList = () => import("@/components/pages/cotas/List");
const CotaEdit = () => import("@/components/pages/cotas/Edit");

const ClienteList = () => import("@/components/pages/clientes/List");
const ClienteEdit = () => import("@/components/pages/clientes/Edit");

const DependenteList = () => import("@/components/pages/dependentes/List");
const DependenteEdit = () => import("@/components/pages/dependentes/Edit");

const ReservaList = () => import("@/components/pages/reservas/List");
const ReservaEdit = () => import("@/components/pages/reservas/Edit");

const PrecoList = () => import("@/components/pages/precificacoes/List");
const PrecoEdit = () => import("@/components/pages/precificacoes/Edit");

const FormaPagamentoList = () => import("@/components/pages/formasPagamento/List");
const FormaPagamentoEdit = () => import("@/components/pages/formasPagamento/Edit");

const CondicaoPagamentoList = () => import("@/components/pages/condicoesPagamento/List");
const CondicaoPagamentoEdit = () => import("@/components/pages/condicoesPagamento/Edit");

const FornecedorList = () => import("@/components/pages/fornecedores/List");
const FornecedorEdit = () => import("@/components/pages/fornecedores/Edit");

const ServicoList = () => import("@/components/pages/servicos/List");
const ServicoEdit = () => import("@/components/pages/servicos/Edit");

const ProdutoList = () => import("@/components/pages/produtos/List");
const ProdutoEdit = () => import("@/components/pages/produtos/Edit");

const PaisList = () => import("@/components/pages/paises/List");
const PaisEdit = () => import("@/components/pages/paises/Edit");

const EstadoList = () => import("@/components/pages/estados/List");
const EstadoEdit = () => import("@/components/pages/estados/Edit");

const CidadeList = () => import("@/components/pages/cidades/List");
const CidadeEdit = () => import("@/components/pages/cidades/Edit");

Vue.use(VueRouter)

const routes = [
    {
        path: '/app',
        name: '',
        component: Home,
        meta: {
            label: "Home"
        },
        children: [
            // INÍCIO
            {
                name: "app",
                path: "",
                component: Inicio,
                meta: {
                    label: "Início"
                },
            },

            // EMPRESAS
            {
                path: 'empresas',
                name: 'EmpresasList',
                component: EmpresaList,
                meta: {
                    label: "Empresas"
                },
            },
            {
                path: 'empresas/cadastrar',
                name: 'EmpresasCad',
                component: EmpresaEdit,
                meta: {
                    label: "Empresa"
                },
            },
            {
                path: 'empresas/editar/:codigo',
                name: 'EmpresasEdit',
                component: EmpresaEdit,
                meta: {
                    label: "Empresa"
                },
            },

            // CONTAS BANCARIAS
            {
                path: 'contasBancarias',
                name: 'ContasBancariasList',
                component: ContaBancariaList,
                meta: {
                    label: "Contas Bancarias"
                },
            },
            {
                path: 'contasBancarias/cadastrar',
                name: 'ContasBancariasCad',
                component: ContaBancariaEdit,
                meta: {
                    label: "Conta Bancaria"
                },
            },
            {
                path: 'contasBancarias/editar/:codigo',
                name: 'ContasBancariasEdit',
                component: ContaBancariaEdit,
                meta: {
                    label: "Conta Bancaria"
                },
            },

            // FUNCIONÁRIOS
            {
                path: 'funcionarios',
                name: 'FuncionariosList',
                component: FuncionarioList,
                meta: {
                    label: "Funcionários"
                },
            },
            {
                path: 'funcionarios/cadastrar',
                name: 'FuncionariosCad',
                component: FuncionarioEdit,
                meta: {
                    label: "Funcionário"
                },
            },
            {
                path: 'funcionarios/editar/:codigo',
                name: 'FuncionariosEdit',
                component: FuncionarioEdit,
                meta: {
                    label: "Funcionário"
                },
            },
            
            // COTAS
            {
                path: 'cotas',
                name: 'CotasList',
                component: CotaList,
                meta: {
                    label: "Cotas"
                },
            },
            {
                path: 'cotas/cadastrar',
                name: 'CotasCad',
                component: CotaEdit,
                meta: {
                    label: "Cota"
                },
            },
            {
                path: 'cotas/editar/:codigo',
                name: 'CotasEdit',
                component: CotaEdit,
                meta: {
                    label: "Cota"
                },
            },

            // CLIENTES
            {
                path: 'clientes',
                name: 'ClientesList',
                component: ClienteList,
                meta: {
                    label: "Clientes"
                },
            },
            {
                path: 'clientes/cadastrar',
                name: 'ClientesCad',
                component: ClienteEdit,
                meta: {
                    label: "Cliente"
                },
            },
            {
                path: 'clientes/editar/:codigo',
                name: 'ClientesEdit',
                component: ClienteEdit,
                meta: {
                    label: "Cliente"
                },
            },

            // DEPENDENTES
            {
                path: 'dependentes',
                name: 'DependentesList',
                component: DependenteList,
                meta: {
                    label: "Dependentes"
                },
            },
            {
                path: 'dependentes/cadastrar',
                name: 'DependentesCad',
                component: DependenteEdit,
                meta: {
                    label: "Dependente"
                },
            },
            {
                path: 'dependentes/editar/:codigo',
                name: 'DependentesEdit',
                component: DependenteEdit,
                meta: {
                    label: "Dependente"
                },
            },
            
            // RESERVAS
            {
                path: 'reservas',
                name: 'ReservasList',
                component: ReservaList,
                meta: {
                    label: "Reservas"
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
                    label: "Reserva"
                },
            },
            
            // PRECIFICAÇÕES
            {
                path: 'precificacoes',
                name: 'PrecificacoesList',
                component: PrecoList,
                meta: {
                    label: "Preços"
                },
            },
            {
                path: 'precificacoes/cadastrar',
                name: 'PrecificacoesCad',
                component: PrecoEdit,
                meta: {
                    label: "Preço"
                },
            },
            {
                path: 'precificacoes/editar/:codigo',
                name: 'PrecificacoesEdit',
                component: PrecoEdit,
                meta: {
                    label: "Preço"
                },
            },
            
            // FORMAS DE PAGAMENTO
            {
                path: 'formasPagamento',
                name: 'FormasPagamentoList',
                component: FormaPagamentoList,
                meta: {
                    label: "Formas de Pagamento"
                },
            },
            {
                path: 'formasPagamento/cadastrar',
                name: 'FormasPagamentoCad',
                component: FormaPagamentoEdit,
                meta: {
                    label: "Forma de Pagamento"
                },
            },
            {
                path: 'formasPagamento/editar/:codigo',
                name: 'FormasPagamentoEdit',
                component: FormaPagamentoEdit,
                meta: {
                    label: "Forma de Pagamento"
                },
            },
            
            // CONDIÇÕES DE PAGAMENTO
            {
                path: 'condicoesPagamento',
                name: 'CondicoesPagamentoList',
                component: CondicaoPagamentoList,
                meta: {
                    label: "Condições de Pagamento"
                },
            },
            {
                path: 'condicoesPagamento/cadastrar',
                name: 'CondicoesPagamentoCad',
                component: CondicaoPagamentoEdit,
                meta: {
                    label: "Condição de Pagamento"
                },
            },
            {
                path: 'condicoesPagamento/editar/:codigo',
                name: 'CondicoesPagamentoEdit',
                component: CondicaoPagamentoEdit,
                meta: {
                    label: "Condição de Pagamento"
                },
            },
            
            // FORNECEDORES
            {
                path: 'fornecedores',
                name: 'FornecedoresList',
                component: FornecedorList,
                meta: {
                    label: "Fornecedores"
                },
            },
            {
                path: 'fornecedores/cadastrar',
                name: 'FornecedoresCad',
                component: FornecedorEdit,
                meta: {
                    label: "Fornecedor"
                },
            },
            {
                path: 'fornecedores/editar/:codigo',
                name: 'FornecedoresEdit',
                component: FornecedorEdit,
                meta: {
                    label: "Fornecedor"
                },
            },
            
            // SERVIÇOS
            {
                path: 'servicos',
                name: 'ServicosList',
                component: ServicoList,
                meta: {
                    label: "Serviços"
                },
            },
            {
                path: 'servicos/cadastrar',
                name: 'ServicosCad',
                component: ServicoEdit,
                meta: {
                    label: "Serviço"
                },
            },
            {
                path: 'servicos/editar/:codigo',
                name: 'ServicosEdit',
                component: ServicoEdit,
                meta: {
                    label: "Serviço"
                },
            },
            
            // PRODUTOS
            {
                path: 'produtos',
                name: 'ProdutosList',
                component: ProdutoList,
                meta: {
                    label: "Produtos"
                },
            },
            {
                path: 'produtos/cadastrar',
                name: 'ProdutosCad',
                component: ProdutoEdit,
                meta: {
                    label: "Produto"
                },
            },
            {
                path: 'produtos/editar/:codigo',
                name: 'ProdutosEdit',
                component: ProdutoEdit,
                meta: {
                    label: "Produto"
                },
            },
            
            // PAÍSES
            {
                path: 'paises',
                name: 'PaisesList',
                component: PaisList,
                meta: {
                    label: "Países"
                },
            },
            {
                path: 'paises/cadastrar',
                name: 'PaisesCad',
                component: PaisEdit,
                meta: {
                    label: "País"
                },
            },
            {
                path: 'paises/editar/:codigo',
                name: 'PaisesEdit',
                component: PaisEdit,
                meta: {
                    label: "País"
                },
            },
            
            // ESTADOS
            {
                path: 'estados',
                name: 'EstadosList',
                component: EstadoList,
                meta: {
                    label: "Estados"
                },
            },
            {
                path: 'estados/cadastrar',
                name: 'EstadosCad',
                component: EstadoEdit,
                meta: {
                    label: "Estado"
                },
            },
            {
                path: 'estados/editar/:codigo',
                name: 'EstadosEdit',
                component: EstadoEdit,
                meta: {
                    label: "Estado"
                },
            },
            
            // CIDADES
            {
                path: 'cidades',
                name: 'CidadesList',
                component: CidadeList,
                meta: {
                    label: "Cidades"
                },
            },
            {
                path: 'cidades/cadastrar',
                name: 'CidadesCad',
                component: CidadeEdit,
                meta: {
                    label: "Cidade"
                },
            },
            {
                path: 'cidades/editar/:codigo',
                name: 'CidadesEdit',
                component: CidadeEdit,
                meta: {
                    label: "Cidade"
                },
            },
        ]
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

function changePageTitle(title){
    const posfix = ' - SincoFoz';
    document.title = title + posfix;
}

router.beforeEach((to, from, next) => {
    changePageTitle(to.meta.label);
    next();
});

export default router