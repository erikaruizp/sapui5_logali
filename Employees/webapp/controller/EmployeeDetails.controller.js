//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "logaligroup/Employees/model/formatter",
        "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller,formatter,MessageBox) {

    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
    };
    function onCreateIncidence() {
        var tableInc = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence",this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var arrayData = incidenceModel.getData();
        var index = arrayData.length;
        arrayData.push({ index: index + 1,
                         CreationDateState: "Error",
                         ReasonState: "Error"
                        });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index );
        tableInc.addContent(newIncidence);
    };
    function onDeleteIncidence(oEvent) {
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        let msgConfirmDelete = oResourceBundle.getText("msgConfirmDelete");        
        let objeto = oEvent.getSource().getBindingContext("incidenceModel").getObject();

        MessageBox.confirm(msgConfirmDelete,{
            title: oResourceBundle.getText("titleConfirm"),
            onClose: function (answer) {
                if (answer === "OK") {                                                        
                    this._bus.publish("incidence","onDeleteIncidence",{
                        IncidenceId: objeto.IncidenceId,
                        SapId: objeto.SapId,
                        EmployeeId: objeto.EmployeeId
                    });                   
                }
            }.bind(this),
            styleClass: "",
            actions: MessageBox.Action.Close,
            emphasizedAction: null,
            initialFocus: null,
            textDirection: sap.ui.core.TextDirection.Inherit         
        });  

    };
    function onSaveIncidence(oEvent) {
        var row = oEvent.getSource().getParent().getParent();
        var contextRow = row.getBindingContext("incidenceModel");

        this._bus.publish("incidence","onSaveIncidence",{incidenceRow: contextRow.sPath.replace('/','')});        
    };
    function onUpdateDateX(oEvent) {
        let objeto = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        let msgInvalidDate = oResourceBundle.getText("msgInvalidDate");

        if (oEvent.getSource().isValidValue()) {
            objeto.CreationDateState = "None";
            objeto.CreationDateX = true;            
        } else {
            objeto.CreationDateState = "Error";   
            objeto.CreationDateX = false;
            MessageBox.error(msgInvalidDate,{
                title: "Error",
                onClose: null,
                styleClass: "",
                actions: MessageBox.Action.Close,
                emphasizedAction: null,
                initialFocus: null,
                textDirection: sap.ui.core.TextDirection.Inherit
            });        
        };
        oEvent.getSource().getBindingContext("incidenceModel").getModel().refresh();
    };
    function onUpdateReasonX(oEvent) {
        var objeto = oEvent.getSource().getBindingContext("incidenceModel").getObject();        

        if (oEvent.getSource().getValue()) {
            objeto.ReasonState = "None";
            objeto.ReasonX = true;            
        } else {
            objeto.ReasonState = "Error";            
            objeto.ReasonX = false;            
        };
        oEvent.getSource().getBindingContext("incidenceModel").getModel().refresh();        
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