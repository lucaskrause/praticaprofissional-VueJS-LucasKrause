<template>
    <div class="row">
        <Nav/>
        <div class="col-md-9 col-lg-9 col-xl-10 col-sm-8 pt-3">
            <div class="row">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import Nav from "@/components/parts/Nav";
export default {
    name: "Home",
    components: { Nav },
    data () {
        return {
            
        }
    },
}
</script>

<style>
    .isRequired{
        color: red;
    }
</style>