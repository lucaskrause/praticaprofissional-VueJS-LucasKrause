<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <v-calendar
                    class="custom-calendar max-w-full"
                    :masks="masks"
                    :disabled-dates='disabledDates'
                    :min-date="minData"
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
import {LocacoesService} from '@/services/locacoes.service'
import Helper from '@/components/helper'
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'

export default {
    components: { PopoverRow },
    data() {
        return {
            colors: ['red', 'blue', 'brown', 'black'],
            minData: Helper.addDays(new Date(), 4),
            disabledDates: [],
            masks: { weekdays: 'WWWW' },
            attributes: [],
            dateSelected: null
        };
    },
    created() {
        const vm = this;
        LocacoesService.getAll().then(function (response) {
            var dateLocacao;
            var attribute;
            var disabledDate;
            var locacao;
            var area;
            for (let i = 0; i < response.data.length; i++) {
                locacao = response.data[i];
                dateLocacao = Helper.addDays(Helper.dateToDateString(locacao.dtLocacao), 1);
                for (let j = 0; j < locacao.areasLocacao.length; j++) {
                    area = locacao.areasLocacao[j];
                    attribute = {
                        key: i + 1,
                        bar: vm.colors[j],
                        popover: {
                            label: area.descricao
                        },
                        dates: dateLocacao
                    }
                    vm.attributes.push(attribute);
                }
                disabledDate = {
                    start: dateLocacao,
                    end: dateLocacao 
                };
                vm.disabledDates.push(disabledDate);
            }
        });
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