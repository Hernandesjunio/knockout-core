/**
 * Created by Hernandes on 28/08/2016.
 */
uriVirtualPath = "/knockout-core";


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