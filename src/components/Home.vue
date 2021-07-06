<template>
    <div class="row">
        <Nav/>
        <div class="col-sm-6 col-md-9 col-lg-10 col-xl-10 pt-3">
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
    color: #dc3545;
}
.invalid{
    color: #dc3545
}
.valid{
    color: green
}
</style>