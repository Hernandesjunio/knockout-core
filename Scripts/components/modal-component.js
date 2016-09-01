function ModalComponent(params, componentInfo) {
    var self = this;
    this.data = params.items;

    this.header = ko.observableArray([componentInfo.templateNodes[1]]);
    this.body = ko.observableArray([componentInfo.templateNodes[3]]);
    this.footer = ko.observableArray([componentInfo.templateNodes[5]]);

    this.modalID = ko.observable('modal');

    if (params.modalID)
        this.modalID(params.modalID);

    this.fazAlgo = function (a) {
        alert('Faz algo dentro do componente');
    }
}

define('modal-component', ['text!modal-component-tmpl'], function (htmlString) {

    var modalComponent;

    ko.components.register('modal-component', {
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
                modalComponent = new ModalComponent(params, componentInfo);
                return modalComponent;
            }
        }

    });

    return { viewModel: modalComponent, htmlString: htmlString };
});