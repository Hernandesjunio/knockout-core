var paths={};
var shim={};

var pathsVendors = {
    //vendors references
    'domReady': '/Scripts/vendor/domReady',
    'jquery':'/scripts/jquery-3.1.0',
    'knockout':'/scripts/knockout-3.4.0',
    'knockout-validation':'/scripts/knockout.validation',
    'bootstrap':'/scripts/bootstrap',
    'text': '/scripts/vendor/text'
};

var shimVendors = {
    'jquery': { exports:'$' },
    'knockout':{
        deps:['jquery'],
        exports:'ko'
    },
    'knockout-validation':{
        deps:['knockout'],
        exports:'kv'
    },
    'bootstrap':{
        deps:['jquery'],
        exports:'bs'
    },
    'domReady':{
        deps:['jquery'],
        exports:'domReady'
    },
    'sub-component':['knockout']
};

var pathsBusiness =  {
    //business references
    'modal-component': '/Scripts/components/modal-component',
    'sub-component': '/Scripts/components/sub-component',
    'sub-component-tmpl': '/Content/templates/sub-component-tmpl.html',
    'modal-component-tmpl': '/Content/templates/modal-component-tmpl.html'
};

function mergeProperties (owner, array){
    for( var p in array){
        owner[p] = array[p];
    }
}

mergeProperties(paths, pathsVendors)
mergeProperties(paths, pathsBusiness);

mergeProperties(shim, shimVendors);

for( var p in paths){
    paths[p] = uriVirtualPath + paths[p];
}

require.config({
    baseUrl: '/Scripts',
    paths: paths,
    shim:shim,
    //urlArgs:'?v1.1.2',
    waitSeconds:5
});

var domReady = function (callback) {
    require(['!./domReady'], function (domReady, tmpl) {
        require(['knockout','jquery','bootstrap'],function(knockout,jquery){
            ko = knockout;
            domReady(callback);
        });
    });
}


