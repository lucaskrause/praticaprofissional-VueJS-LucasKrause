<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <v-calendar
                    class="custom-calendar max-w-full"
                    :masks="masks"
                    :disabled-dates='[
                        {
                            start: "2021-09-18",
                            end: "2021-09-18" 
                        }
                    ]'
                    :min-date='new Date()'
                    :attributes="attributes"
                    @dayclick="diaSelecionado"
                    is-expanded
                >
                    <template #day-popover="{ attributes }">
                        <popover-row v-for="attr in attributes" :key="attr.key" :attribute="attr">
                            {{ attr.popover.label }}
                        </popover-row>
                    </template>
                </v-calendar>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="offset-4 col-2">
                <input type="text" class="form-control" v-model="dateSelected" disabled/>
            </div>
            <div class="col-2">
                <button class="btn btn-success" @click.prevent="selectData" :disabled="!dateSelected">Selecionar data</button>
            </div>
        </div>
    </div>
</template>

<script>
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'

export default {
    components: { PopoverRow },
    data() {
        return {
            masks: {
                weekdays: 'WWWW',
            },
            attributes: [
                {
                    key: 1,
                    bar: 'red',
                    popover: {
                        label: "Sede"
                    },
                    dates: new Date('2021-09-18'),
                },
                {
                    key: 2,
                    bar: 'blue',
                    popover: {
                        label: "Campo"
                    },
                    dates: new Date('2021-09-18'),
                },
            ],
            dateSelected: null
        };
    },
    methods: {
        diaSelecionado(data) {
            if(data.isDisabled) {
                return;
            }
            this.dateSelected = data.id;
        },
        selectData() {
            this.$emit('emit-data', this.dateSelected);
        }
    }
};
</script>