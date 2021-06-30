import {Notyf} from 'notyf';

const notyf = new Notyf();

const Helper = {

    saveErrorCallBack(response, notify = true) {
        let result = false;
        if ( response.status === 400) {
            const errorsList = response.data.errors;
            let text = [];
            for (let i = 0; i < errorsList.length; i++) {
                text.push(errorsList[i].field + ": " + errorsList[i].errorDescription);
            }
            result = text.join(", ");
        }
        if (response.status === 422) {
            result = (response.data.message);
        }

        return notify && result ? notyf.error(result) : result;
    },

    number_format(val) {
        return new Intl.NumberFormat('pt-BR',
            {
                style: 'currency', currency: 'BRL'
            }
        ).format(val)
    },

    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    focusOnError(contexts, EntityKey = 'Entity') {
        contexts.forEach(function (context) {
            for (let key in Object.keys(context.$v[EntityKey])) {
                const input = Object.keys(context.$v[EntityKey])[key];

                if (input.includes("$")) return false;
                if (context.$v[EntityKey][input].$error) {
                    if (context.$refs[input].$el) context.$refs[input].$el.focus();
                    else context.$refs[input].focus();
                    break;
                }
            }
        })
    },

    validatorCPF(strCPF) {
        var Soma;
        var Resto;
        Soma = 0;
        if (strCPF == "00000000000") return false;

        for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11))) return false;
        return true;
    },

    validarCNPJ(cnpj) {
        if(!cnpj || cnpj == '') return false;

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '') return false;

        if (cnpj.length != 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return false;

        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        return true;
    },

    //formato esperado 2020-01-31
    dateStringToDate(str) {
        let aux = str.split("-");
        aux[1]--;
        return new Date(...aux);
    },

    brToUsDate(str) {
        let aux = str.split("/");
        return [aux[2], aux[1], aux[0]].join('-');
    },

    usToBrDate(str) {
        if(!str) return "";
        let aux = str.split("-");
        return [aux[2], aux[1], aux[0]].join('/');
    },

    serverDateToDateString(str, withHour = false) {
        if(!str) return '';
        if(!withHour) return this.usToBrDate(str.split('T')[0]);
        let aux = str.split('T');
        return {date: aux[0], hour: aux[1].split(".")[0]}
    },

    serverDateToDateTimeString(str) {
        if(!str) return '';
        let aux = str.split('T');
        return {date: this.usToBrDate(aux[0]), hour: aux[1].split(".")[0]}
    },

    dateToDateString(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
};

export default Helper;
