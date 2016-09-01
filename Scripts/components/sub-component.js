﻿function SubComponent(params, componentInfo) {
    var self = this;

    self.data = params.element;

    self.fazAlgo = function () {
        alert('Sub Component');
    }
}
    
//define('sub-component', function (htmlString) {
//    return SubComponent;
//});

define('sub-component', ['text!sub-component-tmpl'], function (htmlString) {
    var subComponent;

    ko.components.register('sub-component', {
        template: htmlString,// { element: 'sub-component-template' },
        viewModel: {
            createViewModel: function (params, componentInfo) {
                // - 'params' is an object whose key/value pairs are the parameters
                //   passed from the component binding or custom element
                // - 'componentInfo.element' is the element the component is being
                //   injected into. When createViewModel is called, the template has
                //   already been injected into this element, but isn't yet bound.
                // - 'componentInfo.templateNodes' is an array containing any DOM
                //   nodes that have been supplied to the component. See below.

                // Return the desired view model instance, e.g.:
                subComponent = new SubComponent(params, componentInfo);
                return subComponent;
            }
        }

    });

    return { viewModel: subComponent, htmlString: htmlString };
});