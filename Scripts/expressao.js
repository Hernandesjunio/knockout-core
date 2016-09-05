/**
 * Created by Hernandes on 03/09/2016.
 */

function Expressao(){
    var self = this;
    self.resultado = ko.observable();
    self.operadoresLogicos = ko.observableArray();
    self.operadoresCondicionais = ko.observableArray();
    self.parent = ko.observable();
    self.parents = ko.observableArray();
    self.root = ko.observable(this);

    self.owner = ko.observable();
    self.profundidade = ko.observable(0);

    self.objEval = ko.observable();

    self.getObjEval = function(){
        return self.root().objEval();
    };

    self.setObjEval = function(value){
        self.root().objEval(value);
    };

    self.novoGrupo = function(){
        var exp = new Expressao();
        exp.parent(this);
        exp.owner(self.owner());

        exp.parents.push(this);
        self.parents().forEach(function(parent){exp.parents.push(parent)});
        exp.profundidade(self.profundidade()+1);
        exp.root(exp.parents()[exp.parents().length-1]);

        self.operadoresCondicionais.push(exp);

        return exp;
    };

    self.toString = function(){
        var array=[];

        array.push("(");
        self.operadoresCondicionais().forEach(function(item, index){
            array.push(item.toString());
            if(self.operadoresLogicos().length > index)
                array.push(self.operadoresLogicos()[index]);
        });
        array.push(")");

        return array.join(" ");
    }
}

function getProp(list){
    var r;
    for(var item in list) {
        if(r == undefined)
            r= item;
    }

    return r;
}

function Equal(expressao,condicao){
    var self = this;
    var prop = getProp(condicao);

    self.resultado = ko.observable();
    self.execute = function(){
        self.resultado( getVal(expressao.getObjEval()[prop]) == getVal(condicao[prop]));
    };

    self.toString= function(){
        return prop + " = " + getVal(condicao[prop]);
    }
}



/*
function Equal(p1, p2){
    var self = this;
    self.resultado = ko.observable();

    self.execute = function(){
        self.resultado(getVal(p1) === getVal(p2));
    }

    self.toString= function(){
        return getVal(p1) + " = " + getVal(p2);
    }
}
*/
//condicao {PropertyName:value}
Expressao.prototype.equal = function(condicao){
    if(this.operadoresCondicionais().length == this.operadoresLogicos().length)
        this.operadoresCondicionais().push(new Equal(this, condicao));
    return this;
};

/*
Expressao.prototype.equal = function(condicao){
    if(this.operadoresCondicionais().length == this.operadoresLogicos().length)
        this.operadoresCondicionais().push(new Equal(p1,p2));

    return this;
}*/


Expressao.prototype.or = function(){
    if(this.operadoresCondicionais().length > this.operadoresLogicos().length)
        this.operadoresLogicos.push("or");

    return this;
};

Expressao.prototype.and = function(){
    if(this.operadoresCondicionais().length > this.operadoresLogicos().length)
        this.operadoresLogicos.push("and");

    return this;
};

Expressao.prototype.execute = function(){
    this.operadoresCondicionais().forEach(function(op){
        op.execute();
    });

    return this;
};

Expressao.prototype.toResult = function(){
    var self = this;
   return ko.utils.arrayFilter(this.owner(), function(item){
        self.setObjEval(item);
        return self.root().construir().resultado();
    });
};

Expressao.prototype.construir = function(){
    this.execute();

    var operadoresLogicos = ko.utils.arrayMap(this.operadoresLogicos(),function(item){
        return item;
    });

    var operadoresCondicionais = ko.utils.arrayMap(this.operadoresCondicionais(),function(item){
        return item;
    });
    var i,result;

    for( i = 0;i< operadoresLogicos.length;i++){
        if(operadoresLogicos[i] == 'and'){
            result = operadoresCondicionais[i].resultado() && operadoresCondicionais[i+1].resultado();
            operadoresCondicionais.splice(i,1);
            operadoresCondicionais[i].resultado(result);
            operadoresLogicos.splice(i,1);
            i--;
        }
    }

    for( i = 0;i< operadoresLogicos.length;i++){
        result = operadoresCondicionais[i].resultado() || operadoresCondicionais[i+1].resultado();
        operadoresCondicionais.splice(i,1);
        operadoresCondicionais[i].resultado(result);
        operadoresLogicos.splice(i,1);
        i--;
    }

    this.resultado(operadoresCondicionais[0].resultado());

    return this;
};

var getVal = ko.utils.unwrapObservable;


Array.prototype.forEach = function(callback){
    ko.utils.arrayForEach(this,callback);
};

Array.prototype.where = function(){
    var self = this;
    self.expressao = new Expressao();
    self.expressao.owner(this);

    return self.expressao;
};

define(['expressao'],function(){
    return Expressao;
});