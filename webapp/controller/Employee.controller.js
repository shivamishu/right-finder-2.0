sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    Controller,
    JSONModel,
    MessageToast,
    Fragment,
    DateFormat,
    Filter,
    FilterOperator
  ) {
    "use strict";
    var _sIdentity = "cmpe272.ss";
    var sLogOutUrl =
      "https://rightfinder.auth.ap-south-1.amazoncognito.com/logout?client_id=4khht0k2e1r2k5v3ei7hsp8smd&logout_uri=https://master.dumii96ks5gdv.amplifyapp.com/";
    var sUrl =
      "https://rightfinder.auth.ap-south-1.amazoncognito.com/login?client_id=4khht0k2e1r2k5v3ei7hsp8smd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://master.dumii96ks5gdv.amplifyapp.com/";
    return Controller.extend("aws.LightningStorage.controller.Employee", {
      onInit: function () {
        this._oView = this.getView();
        this._oRouter = this.getOwnerComponent().getRouter();
        this._oRouter
          .getRoute("employee")
          .attachPatternMatched(this._onRouteMatched, this);
        this._oEventBus = this.getOwnerComponent().getEventBus();
      },
      _onRouteMatched: function (oEvent) {
        var sMode,
          oModel = this._oView.getModel("newEmployee");
        if (
          oModel.getProperty("/currentEmp") ===
          oModel.getProperty("/employee/mgr_id")
        ) {
          oModel.setProperty("/MGR", true);
        } else {
          oModel.setProperty("/MGR", false);
        }
        if (oModel.getProperty("/ADMIN")) {
          this._getManagers();
        } else {
          oModel.setProperty("/ADMIN", false);
        }
      },
      _getManagers: function () {
        var oModel = this._oView.getModel("newEmployee");
        $.ajax({
          type: "GET",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://vu84dpyf0g.execute-api.us-west-1.amazonaws.com/v1?mode=mgr",
          crossDomain: true,
          dataType: "json",
          success: function (data) {
            oModel.setProperty("/managers", data.result);
          }.bind(this),
          error: function (error) {
            //error
          }.bind(this),
        });
      },
      onAvatarPress: function (oEvent) {
        var oAvatar = oEvent.getSource();
        if (!this._oMenu) {
          Fragment.load({
            name: "aws.LightningStorage.view.Avatar",
            controller: this,
          }).then(
            function (oPopover) {
              this._oMenu = oPopover;
              var sCompactCozyClass = this.getOwnerComponent().getContentDensityClass();
              jQuery.sap.syncStyleClass(
                sCompactCozyClass,
                this._oView,
                oPopover
              );
              this._oView.addDependent(this._oMenu);
              this._oMenu.setModel(this._oView.getModel("mainModel"));
              this._oMenu.openBy(oAvatar);
            }.bind(this)
          );
        } else {
          this._oMenu.openBy(oAvatar);
        }
      },
      onSuggest: function (oEvent) {
        var sTerm = oEvent.getParameter("suggestValue");
        var aFilters = [];
        if (sTerm) {
          aFilters.push(new Filter("mgr_id", FilterOperator.StartsWith, sTerm));
        }
        oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
      },

      handleUploadPress: function (oEvent) {
        var oFileUploader = this._oView.byId("fileUploader2"),
          oFile = oFileUploader.oFileUpload.files[0],
          oMainModel = this.getView().getModel("newEmployee");
        if (oFile) {
          // var oUploadSet = this._oView.byId("UploadCollection"),
          // aUploadCollectionItems = oUploadSet.getItems(),
          oFileUploader.setBusy(true);
          var sMode = "POST",
            sUrl = "/api/upload_photo",
            sFileName = "",
            currIndx = -1,
            prevUTime = "";
          oMainModel.setProperty("/busyUpload", true);
          var formData = new FormData(),
            currTime = Date.now().toString();

          formData.append("utime", currTime);
          formData.append("mgr_id", oMainModel.getProperty("/employee/emp_id"));
          // formData.append("fname", "Shivam");
          // formData.append("lname", "Shrivastav");
          // formData.append("utime", Date.now().toString());
          formData.append("fileToUpload", oFile, oFile.name);
          // formData.append("user_id", "s.s@gmail.com");
          formData.append("ctime", currTime);
          var params = {
            url: sUrl,
            timeout: 0,
            headers: {
              Authorization: `Bearer ${window.sessionStorage.accessToken}`,
            },
            processData: false,
            method: sMode,
            mimeType: "multipart/form-data",
            contentType: false,
            data: formData,
            crossDomain: true
          };

          $.ajax(params).done(function (response, success) {
            oFileUploader.setBusy(false);
            if (success === "success") {
              response = JSON.parse(response);
              oMainModel.setProperty("/employee/photo_url", response.url);
              oFileUploader.setValue(null);
              oMainModel.setProperty(
                "/photoMsg",
                "Photo Uploaded Successfully"
              );
              oMainModel.setProperty("/photoSuccess", true);
              oMainModel.setProperty("/photoError", false);
            } else {
              oMainModel.setProperty(
                "/photoMsg",
                "An error occurred. Please retry."
              );
              oMainModel.setProperty("/photoError", true);
              oMainModel.setProperty("/photoSuccess", false);
            }
            oMainModel.setProperty("/busyUpload", false);
          });
        } else {
          MessageToast.show("Please choose a file to uploaded");
        }
      },
      handleEditPhoto: function () {
        var oMainModel = this.getView().getModel("newEmployee");
        oMainModel.setProperty("/photoError", false);
        oMainModel.setProperty("/photoSuccess", false);
        if (!this._oPhotoDialog) {
          this._oPhotoDialog = sap.ui.xmlfragment(
            this._oView.getId(),
            "aws.LightningStorage.view.Upload2",
            this
          );
          this.attachControl(this._oPhotoDialog);
        }
        this._oPhotoDialog.open();
      },
      handleAfterClose: function () {
        this._oPhotoDialog.close();
      },
      attachControl: function (oControl) {
        var sCompactCozyClass = this.getOwnerComponent().getContentDensityClass();
        jQuery.sap.syncStyleClass(sCompactCozyClass, this.getView(), oControl);
        this.getView().addDependent(oControl);
      },
      onEmail: function (oEvent) {
        var sValue = oEvent.getSource().getText();
        sap.m.URLHelper.triggerEmail(sValue);
      },
      onPhone: function (oEvent) {
        var sValue = oEvent.getSource().getText();
        sap.m.URLHelper.triggerTel(sValue);
      },
      handleDeletePhoto: function () {
        var oMainModel = this.getView().getModel("newEmployee"),
          data = {
            photo_url: oMainModel.getProperty("/employee/photo_url"),
            mgr_id: oMainModel.getProperty("/employee/emp_id"),
          };
        if (!data.photo_url) {
          return;
        }
        oMainModel.setProperty("/photoBusy", true);
        $.ajax({
          type: "DELETE",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://ced4k2xuh5.execute-api.us-west-1.amazonaws.com/v1",
          crossDomain: true,
          dataType: "json",
          data: JSON.stringify(data),
          success: function (data) {
            oMainModel.setProperty("/employee/photo_url", "");
            MessageToast.show("Profile picture deleted successfully");
            oMainModel.setProperty("/photoBusy", false);
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty("/photoBusy", false);
            if (error.status === 401) {
              window.sessionStorage.accessToken = "";
              MessageToast.show("Error occured. Sign in again");
              sap.m.URLHelper.redirect(sUrl, false);
            }
            sap.m.URLHelper.redirect(sUrl, false);
          }.bind(this),
        });
      },
      handleUpdatePress: function (oEvent) {
        var oMainModel = this.getView().getModel("newEmployee"),
          data = oMainModel.getData().employee,
          oSwitch = this._oView.byId("switch2");
        data.available = oSwitch.getState() ? "Yes" : "No";
        data.dob = new Date(data.dob);
        data.is_admin = oMainModel.getProperty("/ADMIN");
        data.is_mgr = oMainModel.getProperty("/MGR");
        data.skils = this._oView
          .byId("multiSkills2")
          .getSelectedKeys()
          .join(", ");
        var oDateFormat = DateFormat.getDateInstance({
          style: "medium",
        });
        data.dob = oDateFormat.format(data.dob);
        oMainModel.setProperty("/employeeBusy", true);
        $.ajax({
          type: "POST",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://vu84dpyf0g.execute-api.us-west-1.amazonaws.com/v1",
          crossDomain: true,
          dataType: "json",
          data: JSON.stringify(data),
          success: function (data) {
            // oMainModel.setProperty("/employees", data.result);

            oMainModel.setProperty("/employeeBusy", false);
            this.onNavPress();
            this._oEventBus.publish(_sIdentity, "itemsRefresh", {
              // Show toast after the navigation to the overview page
              fnAfterNavigate: function () {
                jQuery.sap.delayedCall(400, this, function () {
                  MessageToast.show("Employee's Profile Updated Successfully");
                });
              },
            });
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty("/employeeBusy", false);
            if (error.status === 401) {
              window.sessionStorage.accessToken = "";
              MessageToast.show("Error occured. Sign in again");
              sap.m.URLHelper.redirect(sUrl, false);
            }
            sap.m.URLHelper.redirect(sUrl, false);
          }.bind(this),
        });
      },
      formatURL: function (sUrl) {
        return sUrl ? sUrl : "https://d9ejjjzd6egbz.cloudfront.net/user.png";
      },
      onNavPress: function (oEvent) {
        window.history.go(-1);
      },
      onHomeIconPress: function () {
        window.location.replace("");
      },
      onLogoutPress: function () {
        window.sessionStorage.accessToken = "";
        // window.location.replace("");
        sap.m.URLHelper.redirect(sLogOutUrl, false);
      },
    });
  }
);
