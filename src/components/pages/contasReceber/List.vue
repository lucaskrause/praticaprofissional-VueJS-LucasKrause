<template>
    <div class="col-12">
        <div class="row">
            <div class="col-6 text-left"><h2>Contas à Receber</h2></div>
            <div class="col-6 text-right pt-2">
                <router-link :to="{name: 'ContasReceberCad'}" class="btn btn-success">Nova Conta à Receber</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ContasReceberList"

}
</script>