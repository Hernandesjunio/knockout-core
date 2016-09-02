/**
 * Created by Hernandes on 28/08/2016.
 */
uriVirtualPath = "/knockout-core";

function Expressao(){
    var self = this;
    self.resultado = ko.observable();
    self.operadoresLogicos = ko.observableArray();
    self.operadoresCondicionais = ko.observableArray();
    self.parent = ko.observable();
    self.parents = ko.observableArray();
    self.root = ko.observable();
    self.owner = ko.observable();

    self.execute = function(){
        for(var op in self.operadoresCondicionais()){
            op.execute();
        }
    }

    self.novoGrupo = function(){
        var exp = new Expressao();
        exp.parent(this);
        exp.parents(this.parents());
        exp.root(this.parents[this.length]);

        return exp;
    }
}

Expressao.prototype.equal = function(p1, p2){
    if(this.operadoresCondicionais.length == this.operadoresLogicos.length)
        this.operadoresCondicionais.push(new Equal(p1,p2));
}

Expressao.prototype.or = function(){
    if(this.operadoresCondicionais.length > this.operadoresLogicos.length)
        this.operadoresLogicos.push("or");
}

Expressao.prototype.and = function(){
    if(this.operadoresCondicionais.length > this.operadoresLogicos.length)
    this.operadoresLogicos.push("and");
}

Expressao.prototype.execute = function(){
    for(var p in this.operadoresCondicionais){
        p.execute();
    }
}

Expressao.prototype.construir = function(){
    for(var i = 0;i< this.operadoresLogicos.length;i++){
        var l = this.operadoresLogicos[i];
        if(l == 'and'){
            var result = this.operadoresCondicionais[i] && this.operadoresCondicionais[i+1];
            this.operadoresCondicionais.splice(i,1);
            this.operadoresCondicionais[i] = result;
            this.operadoresLogicos.splice(i,1);
            i--;
        }
    }

    for(var i = 0;i< this.operadoresLogicos.length;i++){
        var l = this.operadoresLogicos[i];

        var result = this.operadoresCondicionais[i] || this.operadoresCondicionais[i+1];
        this.operadoresCondicionais.splice(i,1);
        this.operadoresCondicionais[i] = result;
        this.operadoresLogicos.splice(i,1);
        i--;
    }

    return this.operadoresCondicionais[0];
}


Array.prototype.where = function(){
    var self = this;
    self.expressao = new Expressao();
    self.owner(this);

    return self.expressao;
}

function Equal(p1, p2){
    var self = this;
    self.resultado= ko.observable();

    self.execute = function(){
        self.resultado(p1 === p2);
    }
}

//**********************************************

function criterio(){
    var self = this;
    self.valores = [];
    self.operadoresLogicos =[];

    return this;
}

criterio.prototype.equal = function(val1, val2){
    if(this.valores.length == this.operadoresLogicos.length)
        this.valores.push(val1 === val2);
    return this;
}

criterio.prototype.or = function(){
    if(this.valores.length > this.operadoresLogicos.length)
        this.operadoresLogicos.push('or');
    return this;
}

criterio.prototype.and = function(){
    if(this.valores.length > this.operadoresLogicos.length)
        this.operadoresLogicos.push('and');
    return this;
}

//"(true) or ((false) and (true)) or ((false) and (true) and (false) and (false))"




criterio.prototype.execute = function(){
    for(var i = 0;i< this.operadoresLogicos.length;i++){
        var l = this.operadoresLogicos[i];
        if(l == 'and'){
            var result = this.valores[i] && this.valores[i+1];
            this.valores.splice(i,1);
            this.valores[i] = result;
            this.operadoresLogicos.splice(i,1);
            i--;
        }
    }

    for(var i = 0;i< this.operadoresLogicos.length;i++){
        var l = this.operadoresLogicos[i];

        var result = this.valores[i] || this.valores[i+1];
        this.valores.splice(i,1);
        this.valores[i] = result;
        this.operadoresLogicos.splice(i,1);
        i--;
    }

    return this.valores[0];
}