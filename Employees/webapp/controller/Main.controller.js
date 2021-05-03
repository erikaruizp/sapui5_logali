//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller,JSONModel) {

        function onBeforeRendering() {
          this._detailEmployeeView = this.getView().byId("detailEmployeeView");  
        };
        function onInit() {
            var oJSONModel1 = new JSONModel();
            var oJSONModel2 = new JSONModel();
            var oJSONModel3 = new JSONModel();
            var oView = this.getView();
            //const oResourceBundle = oView.getModel("i18n").getResourceBundle(); 
            oJSONModel1.loadData("./localService/mockdata/Employees.json",false);
            oView.setModel(oJSONModel1,"jsonEmployee");
            oJSONModel2.loadData("./localService/mockdata/Countries.json",false);
            oView.setModel(oJSONModel2,"jsonCountry");    
            oJSONModel3.loadData("./localService/mockdata/Layouts.json",false);
            oView.setModel(oJSONModel3,"jsonLayout");                
            
            var oJSONModelConfig = new JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false,
                visibleShowDetail: true,                 
            });
            oView.setModel(oJSONModelConfig,"jsonConfig");       
            
            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible","onShowEmployee",this.showEmployeeDetail,this);
            this._bus.subscribe("incidence","onSaveIncidence",this.onSaveOdataIncidence,this);
        };
        function showEmployeeDetail(category, nameEvent, path) {
          var detailView = this.getView().byId("detailEmployeeView");  
          detailView.bindElement("odataNorthwind>" + path);
          this.getView().getModel("jsonLayout").setProperty("/ActiveKey","TwoColumnsMidExpanded");

          var incidenceModel = new sap.ui.model.json.JSONModel([]);
          detailView.setModel(incidenceModel,"incidenceModel");
          detailView.byId("tableIncidence").removeAllContent();
        };        
        function onSaveOdataIncidence(channelId,EventId,data) {
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();   
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceArray =  this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceArray[data.incidenceRow].IncidenceId == 'undefined') {
                var body = {
                    SapId : this.getOwnerComponent().SapId,
                    EmployeeId : employeeId.toString(),
                    CreationDate : incidenceArray[data.incidenceRow].CreationDate,
                    Type : incidenceArray[data.incidenceRow].Type,
                    Reason : incidenceArray[data.incidenceRow].Reason
                };
                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("msgSaveOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("msgSaveError"));
                    }.bind(this)
                });                
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("msgNoChanges"));                
            }

        };

        var Main = Controller.extend("logaligroup.Employees.controller.Main", {});

        Main.prototype.onInit = onInit;
        Main.prototype.showEmployeeDetail = showEmployeeDetail;
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onSaveOdataIncidence = onSaveOdataIncidence;

        return Main;
});        