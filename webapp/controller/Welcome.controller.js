sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("aws.LightningStorage.controller.Welcome", {
      onInit: function () {
        this._oRouter = this.getOwnerComponent().getRouter();
        var access_token = new URLSearchParams(window.location.hash).get(
          "access_token"
        );
        access_token = access_token
          ? access_token
          : new URLSearchParams(window.location.hash).get("#access_token");
        if (access_token || window.sessionStorage.accessToken) {
          this.getView().byId("welcomePage").setBusy(true);
          window.sessionStorage.accessToken = access_token
            ? access_token
            : window.sessionStorage.accessToken;
          this._oRouter.navTo("welcome", {}, true);
        } else {
          // window.sessionStorage.accessToken = "";
        }
      },
      onAfterRendering: function () {
        $("#splash-screen").remove();
      },
      handleCognito: function () {
        var sUrl =
          "https://rightfinder.auth.us-west-1.amazoncognito.com/login?client_id=tv98hvjqg6q2bubao0gqte446&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://master.d1l8csbyyor94c.amplifyapp.com/";
        sap.m.URLHelper.redirect(sUrl, false);
      },
    });
  }
);
