sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "aws/LightningStorage/model/models",
    "sap/ui/model/json/JSONModel",
  ],
  function (UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("aws.LightningStorage.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        var sQuery = window.location.search;
        if (sQuery.indexOf("?code") > -1) {
          sQuery = sQuery.replace("?code=", "");
          window.opener.sessionStorage.linkedin_code_1 = sQuery;
          window.close();
          return;
        }else{
          window.sessionStorage.linkedin_code_1 = "";
        }
        if (window.location.hash.indexOf("employee") > -1) {
          window.location.replace("");
        }
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        var oRouter = this.getRouter();
        if (oRouter) {
          oRouter.initialize();
        }
        this.setModel(new JSONModel(), "newEmployee");
        // set the device model
        this.setModel(models.createDeviceModel(), "device");
      },
      getContentDensityClass: function () {
        if (this._sContentDensityClass === undefined) {
          // check whether FLP has already set the content density class; do nothing in this case
          if (
            jQuery(document.body).hasClass("sapUiSizeCozy") ||
            jQuery(document.body).hasClass("sapUiSizeCompact")
          ) {
            this._sContentDensityClass = "";
          } else if (!Device.support.touch) {
            // apply "compact" mode if touch is not supported
            this._sContentDensityClass = "sapUiSizeCompact";
          } else {
            // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
            this._sContentDensityClass = "sapUiSizeCozy";
          }
        }
        return this._sContentDensityClass;
      },
    });
  }
);
