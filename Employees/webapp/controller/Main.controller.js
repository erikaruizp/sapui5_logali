//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
      * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller,JSONModel,MessageBox) {

        function onBeforeRendering() {
          this._detailEmployeeView = this.getView().byId("detailEmployeeView");  
        };
        function onInit() {
            var oView = this.getView();             
            var oJSONModel1 = new JSONModel();
            var oJSONModel2 = new JSONModel();
            var oJSONModel3 = new JSONModel();
 
            oJSONModel1.loadData("./model/json/Employees.json",false);
            oView.setModel(oJSONModel1,"jsonEmployee");
            oJSONModel2.loadData("./model/json/Countries.json",false);
            oView.setModel(oJSONModel2,"jsonCountry");    
            oJSONModel3.loadData("./model/json/Layouts.json",false);
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

            this._bus.subscribe("incidence","onDeleteIncidence",function (channelId,EventId,data) {

                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();                 
                var strEntidadFiltro = "/IncidentsSet(IncidenceId='" + data.IncidenceId + "',SapId='" + data.SapId + 
                                       "',EmployeeId='" + data.EmployeeId + "')";

                this.getView().getModel("incidenceModel").remove(strEntidadFiltro, {
                    success: function () {
                        this.onReadOdataIncidence.bind(this)(data.EmployeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("msgDeleteOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("msgDeleteError"));
                    }.bind(this)
                });                
            },this);
        };
        function showEmployeeDetail(category, nameEvent, path) {
          var detailView = this.getView().byId("detailEmployeeView");  
          detailView.bindElement("odataNorthwind>" + path);
          this.getView().getModel("jsonLayout").setProperty("/ActiveKey","TwoColumnsMidExpanded");

          var incidenceModel = new sap.ui.model.json.JSONModel([]);
          detailView.setModel(incidenceModel,"incidenceModel");
          detailView.byId("tableIncidence").removeAllContent();

          this.onReadOdataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
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
                        this.onReadOdataIncidence.bind(this)(employeeId);
//                        sap.m.MessageToast.show(oResourceBundle.getText("msgSaveOK"));
                        MessageBox.success(oResourceBundle.getText("msgSaveOK"));  
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("msgSaveError"));
                    }.bind(this)
                });                
            } else if ( incidenceArray[data.incidenceRow].CreationDateX || incidenceArray[data.incidenceRow].ReasonX || 
                        incidenceArray[data.incidenceRow].TypeX) {
                var body = {
                    CreationDate : incidenceArray[data.incidenceRow].CreationDate,
                    CreationDateX : incidenceArray[data.incidenceRow].CreationDateX,
                    Type : incidenceArray[data.incidenceRow].Type,
                    TypeX : incidenceArray[data.incidenceRow].TypeX,
                    Reason : incidenceArray[data.incidenceRow].Reason,
                    ReasonX : incidenceArray[data.incidenceRow].ReasonX                    
                };
                var strEntidadFiltro = "/IncidentsSet(IncidenceId='" + incidenceArray[data.incidenceRow].IncidenceId +
                                       "',SapId='" + incidenceArray[data.incidenceRow].SapId + "',EmployeeId='" + 
                                       incidenceArray[data.incidenceRow].EmployeeId + "')";

                this.getView().getModel("incidenceModel").update(strEntidadFiltro, body, {
                    success: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("msgUpdateOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("msgUpdateError"));
                    }.bind(this)
                });                

            } else {                
                sap.m.MessageToast.show(oResourceBundle.getText("msgNoChanges"));                
            }
        };
        function onReadOdataIncidence(employeeId) {
            this.getView().getModel("incidenceModel").read("/IncidentsSet",{
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeId.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);

                    var tableInc = this._detailEmployeeView.byId("tableIncidence");
                    tableInc.removeAllContent();

                    for (i in data.results) {
                        data.results[i].CreationDateState = "None";
                        data.results[i].ReasonState = "None";
                        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence",this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + i );
                        tableInc.addContent(newIncidence);                                                                    
                    }
                }.bind(this),
                error: function (e) {
                    sap.m.MessageToast.show(oResourceBundle.getText("msgReadError"));
                }.bind(this) 
            });
        };

        var Main = Controller.extend("logaligroup.Employees.controller.Main", {});

        Main.prototype.onInit = onInit;
        Main.prototype.showEmployeeDetail = showEmployeeDetail;
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onSaveOdataIncidence = onSaveOdataIncidence;
        Main.prototype.onReadOdataIncidence = onReadOdataIncidence;

        return Main;
});        