import {Notyf} from 'notyf'

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
    
    calculaIdade(dataNasc) { 
        var dataAtual = new Date();
        var anoAtual = dataAtual.getFullYear();
        var anoNascParts = dataNasc.split('-');
        var diaNasc = anoNascParts[2];
        var mesNasc = anoNascParts[1];
        var anoNasc = anoNascParts[0];
        var idade = anoAtual - anoNasc;
        var mesAtual = dataAtual.getMonth() + 1; 
        //Se mes atual for menor que o nascimento, nao fez aniversario ainda;  
        if(mesAtual < mesNasc){
            idade--; 
        } else {
            //Se estiver no mes do nascimento, verificar o dia
            if(mesAtual == mesNasc){ 
                if(new Date().getDate() < diaNasc ){ 
                    //Se a data atual for menor que o dia de nascimento ele ainda nao fez aniversario
                    idade--; 
                }
            }
        } 
        return idade; 
    },

    validadorEmail(email) {
        var usuario = email.substring(0, email.indexOf("@"));
        var dominio = email.substring(email.indexOf("@")+ 1, email.length);
        if ((usuario.length >=1) &&
            (dominio.length >=3) &&
            (usuario.search("@")==-1) &&
            (dominio.search("@")==-1) &&
            (usuario.search(" ")==-1) &&
            (dominio.search(" ")==-1) &&
            (dominio.search(".")!=-1) &&
            (dominio.indexOf(".") >=1)&&
            (dominio.lastIndexOf(".") < dominio.length - 1)) {
            return true;
        }
        return false;
    },

    validadorCPF(strCPF) {
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

    validadorCNPJ(cnpj) {
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

    addMaskCNPJ(cnpj) {
        return cnpj.replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5");
    },

    //formato esperado 2020-01-31
    dateStringToDate(str) {
        if (str == "" || str == null) return null;
        let aux = str.split("-");
        aux[1]--;
        return new Date(...aux);
    },

    brToUsDate(str) {
        if (str == "" || str == null) return null;
        let aux = str.split("/");
        return [aux[2], aux[1], aux[0]].join('-');
    },

    usToBrDate(str) {
        if (str == "" || str == null) return null;
        let aux = str.split("-");
        return [aux[2], aux[1], aux[0]].join('/');
    },

    serverDateToDateString(str, withHour = false) {
        if (str == "" || str == null) return null;
        if(!withHour) return this.usToBrDate(str.split('T')[0]);
        let aux = str.split('T');
        return {date: aux[0], hour: aux[1].split(".")[0]}
    },

    serverDateToDateTimeString(str) {
        if (str == "" || str == null) return null;
        let aux = str.split('T');
        return {date: this.usToBrDate(aux[0]), hour: aux[1].split(".")[0]}
    },

    dateToDateString(date) {
        if (date == "" || date == null) return null;
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
