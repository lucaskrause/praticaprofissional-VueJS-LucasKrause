import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import(/* webpackChunkName: "Home" */ "@/components/Home");

Vue.use(VueRouter)

const routes = [
    {
        path: '/app',
        name: '',
        component: Home,
        meta: {
            label: "Home"
        },
        children: []
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

export default router