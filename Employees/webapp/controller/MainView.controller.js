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
            var oJSONModel = new JSONModel();
            var oView = this.getView();
            //const oResourceBundle = oView.getModel("i18n").getResourceBundle(); 
            // var oJSON = {
            //     employeeId: "1234",
            //     countryKey: "UK",
            //     listCountry: [
            //         {
            //         "key": "US",
            //         "text": oResourceBundle.getText("labelUS")
            //         },
            //         {
            //         "key": "UK",
            //         "text": oResourceBundle.getText("labelUK")
            //         },
            //         {
            //         "key": "ES",
            //         "text": oResourceBundle.getText("labelES")
            //         },
            //         {
            //         "key": "PE",
            //         "text": oResourceBundle.getText("labelPE")
            //         }
            //     ]
            // };
            //oJSONModel.setData(oJSON);
            oJSONModel.loadData("./localService/mockdata/Employees.json",false);
            oView.setModel(oJSONModel);
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
            var oJSON = this.getView().getModel().getData();
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
            var oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId","");
            oModel.setProperty("/CountryKey","");
        };

        function onShowPostal(oEvent) {
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext();
            var objectContext = oContext.getObject();
            var mensaje = oResourceBundle.getText("columnPostal") + ": " + objectContext.PostalCode;
            MessageToast.show(mensaje);
        }

        var Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

		Main.prototype.onInit = onInit;
        Main.prototype.onLiveChange = onLiveChange;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.onShowPostal = onShowPostal;
            

		return Main;
	});
