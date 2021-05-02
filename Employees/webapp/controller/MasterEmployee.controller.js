//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.MessageToast} MessageToast
     */
	function (Controller,JSONModel,Filter,FilterOperator,MessageToast) {
        "use strict";

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
         };
         function onLiveChange() {                
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();                 
                //var mOK = oResourceBundle.getText("textOK");
                //var mNOK = oResourceBundle.getText("textNotOK");

                var idEmp = this.byId("inputEmployee");
                var valueEmp = idEmp.getValue();

                if (valueEmp.length === 6) {
                //    idEmp.setDescription(mOK);
                    this.getView().byId("slCountry").setVisible(true);
                    this.getView().byId("labelCountry").setVisible(true);
                }else{
                //    idEmp.setDescription(mNOK);
                    this.getView().byId("slCountry").setVisible(false);
                    this.getView().byId("labelCountry").setVisible(false);                
                }
            };
        function onFilter() {
            var oJSON = this.getView().getModel("jsonCountry").getData();
            var filters = [];

            if (oJSON.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID",FilterOperator.EQ,oJSON.EmployeeId));
            }

            if (oJSON.CountryKey !== "") {
                filters.push(new Filter("Country",FilterOperator.EQ,oJSON.CountryKey));
            }

            var oTable = this.getView().byId("tableEmployee");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(filters);
        };
        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountry");
            oModel.setProperty("/EmployeeId","");
            oModel.setProperty("/CountryKey","");
        };
        function onShowPostal(oEvent) {
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployee");
            var objectContext = oContext.getObject();
            var mensaje = oResourceBundle.getText("columnPostal") + ": " + objectContext.PostalCode;
            MessageToast.show(mensaje);
        };
        function onShowCity() {
            var oModel = this.getView().getModel("jsonConfig");
            oModel.setProperty("/visibleCity", true);
            oModel.setProperty("/visibleBtnShowCity", false);
            oModel.setProperty("/visibleBtnHideCity", true);
        };
        function onHideCity() {
            var oModel = this.getView().getModel("jsonConfig");
            oModel.setProperty("/visibleCity", false);
            oModel.setProperty("/visibleBtnShowCity", true);
            oModel.setProperty("/visibleBtnHideCity", false);            
        };      
        function onShowOrders(oEvent) {
            var iconPress = oEvent.getSource();
            var oContext = iconPress.getBindingContext("odataNorthwind");

            if (!this._oDialogOrder) {
                this._oDialogOrder = new sap.ui.xmlfragment("logaligroup.Employees.fragment.DialogOrders",this);
                this.getView().addDependent(this._oDialogOrder);                
            }
            this._oDialogOrder.bindElement("odataNorthwind>" + oContext.getPath());
            this._oDialogOrder.open();            
        };
        function onCloseDialog() {
            this._oDialogOrder.close();
        };
        function onShowEmployee(oEvent) {
            var oContext = oEvent.getSource().getBindingContext("odataNorthwind");   
            var path = oContext.getPath();
            this._bus.publish("flexible","onShowEmployee",path);
                        
        }

        var Main = Controller.extend("logaligroup.Employees.controller.MasterEmployee", {});

		Main.prototype.onInit = onInit;
        Main.prototype.onLiveChange = onLiveChange;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.onShowPostal = onShowPostal;
        Main.prototype.onShowCity = onShowCity;            
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.onShowOrders = onShowOrders;
        Main.prototype.onCloseDialog = onCloseDialog;
        Main.prototype.onShowEmployee = onShowEmployee;

		return Main;
	});
