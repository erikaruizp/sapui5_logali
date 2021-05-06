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
        this._bus = sap.ui.getCore().getEventBus();
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
    function onSaveIncidence(oEvent) {
        var row = oEvent.getSource().getParent().getParent();
        var contextRow = row.getBindingContext("incidenceModel");

        this._bus.publish("incidence","onSaveIncidence",{incidenceRow: contextRow.sPath.replace('/','')});        
    };
    function onUpdateDateX(oEvent) {
        var objeto = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        objeto.CreationDateX = true;
    };
    function onUpdateReasonX(oEvent) {
        var objeto = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        objeto.ReasonX = true;        
    };
    function onUpdateTypeX(oEvent) {
        var objeto = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        objeto.TypeX = true;        
    };        
    var Main = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});

    Main.prototype.onInit = onInit;
    Main.prototype.onCreateIncidence = onCreateIncidence;
    Main.prototype.Formatter = formatter;
    Main.prototype.onDeleteIncidence = onDeleteIncidence;
    Main.prototype.onSaveIncidence = onSaveIncidence;
    Main.prototype.onUpdateDateX = onUpdateDateX;
    Main.prototype.onUpdateReasonX = onUpdateReasonX;
    Main.prototype.onUpdateTypeX = onUpdateTypeX;
    
    return Main;
});    