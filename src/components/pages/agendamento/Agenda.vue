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
import {AreasLocacaoService} from '@/services/areasLocacao.service'
import {LocacoesService} from '@/services/locacoes.service'
import Helper from '@/components/helper'
import PopoverRow from 'v-calendar/lib/components/popover-row.umd.min'

export default {
    components: { PopoverRow },
    data() {
        return {
            ListaAreasLocacao: [],
            colors: ['red', 'blue', 'green', 'orange', 'yellow'],
            minData: Helper.addDays(new Date(), 3),
            disabledDates: [],
            masks: { weekdays: 'WWWW' },
            attributes: [],
            dateSelected: null
        };
    },
    created() {
        const vm = this;

        AreasLocacaoService.getAll().then(function (response) {
            vm.ListaAreasLocacao = response.data.map((area) => area.descricao);

            LocacoesService.getAll().then(function (response) {
                var locacoes = response.data;
                var locacao;
                var area;
                var dateLocacao;
                var attribute;
                var validation = [];

                for (let i = 0; i < locacoes.length; i++) {
                    locacao = locacoes[i];
                    dateLocacao = Helper.dateToDateString(Helper.addDays(locacao.dtLocacao, 1));

                    for (let j = 0; j < locacao.areasLocacao.length; j++) {
                        area = locacao.areasLocacao[j];
                        attribute = {
                            key: i + 1,
                            bar: vm.colors[Math.floor(Math.random()*vm.colors.length)],
                            popover: {
                                label: area.descricao
                            },
                            dates: dateLocacao
                        }
                        vm.attributes.push(attribute);
                        
                        if (!validation[dateLocacao]) {
                            validation[dateLocacao] = [];
                        }
                        validation[dateLocacao].push(area.descricao);
                    }
                }
                
                var dates = Object.keys(validation);
                var dayLocation;

                for (let k = 0; k < dates.length; k++) {
                    dayLocation = validation[dates[k]];

                    var disabled = true;
                    for (let l = 0; l < vm.ListaAreasLocacao.length; l++) {
                        disabled = dayLocation.includes(vm.ListaAreasLocacao[l]);
                        if (!disabled) break;
                    }
                    
                    if (disabled) {
                        vm.disabledDates.push( {start: dates[k], end: dates[k]} );
                    }
                }
            });
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