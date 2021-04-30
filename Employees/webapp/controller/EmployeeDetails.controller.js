//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {

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

    var Main = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});

    Main.prototype.onInit = onInit;
    Main.prototype.onCreateIncidence = onCreateIncidence;

    return Main;
});    