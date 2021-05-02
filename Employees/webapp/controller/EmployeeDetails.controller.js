//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "logaligroup/Employees/model/formatter"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,formatter) {

    function onInit() {

    };
    function onCreateIncidence() {
        var tableInc = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence",this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var arrayData = incidenceModel.getData();
        var index = arrayData.length;
        arrayData.push({ index: index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index );
        tableInc.addContent(newIncidence);
    };
    function onDeleteIncidence(oEvent) {
        var table = this.getView().byId("tableIncidence");
        var row = oEvent.getSource().getParent().getParent();
        var model = this.getView().getModel("incidenceModel");
        var data = model.getData();
        var objeto = row.getBindingContext("incidenceModel").getObject();

        data.splice(objeto.index - 1, 1);
        for (var i in data) {
            data[i].index = parseInt(i) + 1;
        }
        model.refresh();
        table.removeContent(row);

        for (var j in table.getContent()) {
            table.getContent()[j].bindElement("incidenceModel>/" + j);
        }
    };
    var Main = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});

    Main.prototype.onInit = onInit;
    Main.prototype.onCreateIncidence = onCreateIncidence;
    Main.prototype.Formatter = formatter;
    Main.prototype.onDeleteIncidence = onDeleteIncidence;
    
    return Main;
});    