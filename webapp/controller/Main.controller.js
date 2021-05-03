sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
  ],
  function (Controller, JSONModel, MessageToast, Fragment, DateFormat) {
    "use strict";
    var _sIdentity = "cmpe272.ss";
    var sLogOutUrl =
      "https://rightfinder.auth.us-west-1.amazoncognito.com/logout?client_id=tv98hvjqg6q2bubao0gqte446&logout_uri=https://master.d1l8csbyyor94c.amplifyapp.com/";
    var sUrl = "https://rightfinder.auth.us-west-1.amazoncognito.com/login?client_id=tv98hvjqg6q2bubao0gqte446&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://master.d1l8csbyyor94c.amplifyapp.com/";
    return Controller.extend("aws.LightningStorage.controller.Main", {
      onInit: function () {
        this._oView = this.getView();
        this._oRouter = this.getOwnerComponent().getRouter();
        var oMainModel = new JSONModel({
          busy: true,
          busyUpload: false,
          delay: 0,
          items: [],
          employee: {},
          photoSuccess: false,
          photoError: false,
          photoMsg: "Photo uploaded successfully",
          totalEmployees: "",
          mimeType: ["image/png", "image/jpeg"],
        });
        this._oEventBus = this.getOwnerComponent().getEventBus();
        this._oEventBus.subscribe(
          _sIdentity,
          "itemsRefresh",
          this.onInvalidateOverview,
          this
        );
        this._oView.setModel(oMainModel, "mainModel");
        this._oRouter
          .getRoute("welcome")
          .attachPatternMatched(this._onRouteMatched, this);
        // var sUserId = "s.s@gmail.com";
        // url: "/api/read_files?user_id=" + sUserId,
        if (window.sessionStorage.accessToken) {
          $.ajax({
            type: "GET",
            headers: {
              Authorization: `Bearer ${window.sessionStorage.accessToken}`,
            },
            contentType: "application/json",
            url: "https://j7jnk6by86.execute-api.us-west-1.amazonaws.com/emp",
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              if (data.result.is_mgr) {
                this._oView
                  .getModel("mainModel")
                  .setProperty("/title", "RightFinder   (MANAGER MODE)");
              } else if (data.result.is_admin) {
                this._oView
                  .getModel("mainModel")
                  .setProperty("/title", "RightFinder   (ADMIN MODE)");
              } else {
                this._oView
                  .getModel("mainModel")
                  .setProperty("/title", "RightFinder   (EMPLOYEE MODE)");
              }
              this._oView
                .getModel("mainModel")
                .setProperty("/employee", data.result);
              this._oView
                .getModel("mainModel")
                .setProperty("/MGR", data.result.is_mgr ? true : false);
              this._oView
                .getModel("mainModel")
                .setProperty("/ADMIN", data.result.is_admin ? true : false);
              this._getAdminReports();
              this._getAdminRequests();
              this._oView
                .getModel("newEmployee")
                .setProperty("/ADMIN", data.result.is_admin ? true : false);
              this._oView
                .getModel("newEmployee")
                .setProperty("/currUserMgr", data.result.is_mgr ? true : false);
              this._oView.getModel("mainModel").setProperty("/busy", false);
              var skills = data.result.skils ? data.result.skils : "",
                aSkills = skills.split(", "),
                aSkillSet = [];
              aSkills.forEach((element) => {
                aSkillSet.push({ key: element, text: element });
              });
              this._oView
                .getModel("mainModel")
                .setProperty("/employee/skillset", aSkillSet);
              this._oView
                .getModel("mainModel")
                .setProperty("/employee/askills", aSkills);
            }.bind(this),
            error: function (error) {
              this._oView.getModel("mainModel").setProperty("/busy", false);
              console.log("Error fetching employee info");
              // var sUrl =
              //   "https://mylightningstorage.auth.ap-south-1.amazoncognito.com/login?client_id=4khht0k2e1r2k5v3ei7hsp8smd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.mylightningstorage.com/";
              if (error.status === 401) {
                MessageToast.show("Error occured. Sign in again");
                window.sessionStorage.accessToken = "";
                sap.m.URLHelper.redirect(sUrl, false);
              }
            }.bind(this),
          });
          this._getDirectReports();
          // this._getAdminReports();
        } else {
          // var sUrl =
          //   "https://mylightningstorage.auth.ap-south-1.amazoncognito.com/login?client_id=4khht0k2e1r2k5v3ei7hsp8smd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.mylightningstorage.com/";
          sap.m.URLHelper.redirect(sUrl, false);
        }
      },
      _getAdminRequests: function () {
        var isAdmin = this._oView.getModel("mainModel").getProperty("/ADMIN");
        if (!isAdmin) {
          return;
        }
        this._oView
          .getModel("mainModel")
          .setProperty("/adminRequestBusy", true);
        $.ajax({
          type: "GET",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://2ingf1wro0.execute-api.us-west-1.amazonaws.com/v1?mode=admin_requests",
          dataType: "json",
          success: function (data) {
            this._oView
              .getModel("mainModel")
              .setProperty("/adminrequests", data.result);
            this._oView
              .getModel("mainModel")
              .setProperty("/adminRequestBusy", false);
          }.bind(this),
          error: function (error) {
            this._oView
              .getModel("mainModel")
              .setProperty("/adminRequestBusy", false);
            console.log("Error fetching direct reports");
            // var sUrl =
            //   "https://mylightningstorage.auth.ap-south-1.amazoncognito.com/login?client_id=4khht0k2e1r2k5v3ei7hsp8smd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.mylightningstorage.com/";
            if (error.status === 401) {
              MessageToast.show("Error occured. Sign in again");
              window.sessionStorage.accessToken = "";
              sap.m.URLHelper.redirect(sUrl, false);
            }
          }.bind(this),
        });
      },
      _getAdminReports: function () {
        var isAdmin = this._oView.getModel("mainModel").getProperty("/ADMIN");
        if (!isAdmin) {
          return;
        }
        this._oView
          .getModel("mainModel")
          .setProperty("/adminReportsBusy", true);
        $.ajax({
          type: "GET",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://2ingf1wro0.execute-api.us-west-1.amazonaws.com/v1?mode=admin",
          crossDomain: true,
          dataType: "json",
          success: function (data) {
            this._oView
              .getModel("mainModel")
              .setProperty("/adminreports", data.result);
            this._oView
              .getModel("mainModel")
              .setProperty("/adminReportsBusy", false);
            var skills = data.result.skils ? data.result.skils : "",
              aSkills = skills.split(", "),
              aSkillSet = [];
            aSkills.forEach((element) => {
              aSkillSet.push({ key: element, text: element });
            });
            this._oView
              .getModel("mainModel")
              .setProperty("/adminreports/skillset", aSkillSet);
            this._oView
              .getModel("mainModel")
              .setProperty("/adminreports/askills", aSkills);
          }.bind(this),
          error: function (error) {
            this._oView
              .getModel("mainModel")
              .setProperty("/adminReportsBusy", false);
            console.log("Error fetching direct reports");
            // var sUrl =
            //   "https://mylightningstorage.auth.ap-south-1.amazoncognito.com/login?client_id=4khht0k2e1r2k5v3ei7hsp8smd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.mylightningstorage.com/";
            if (error.status === 401) {
              MessageToast.show("Error occured. Sign in again");
              window.sessionStorage.accessToken = "";
              sap.m.URLHelper.redirect(sUrl, false);
            }
          }.bind(this),
        });
      },
      _getDirectReports: function () {
        this._oView
          .getModel("mainModel")
          .setProperty("/directReportsBusy", true);
        $.ajax({
          type: "GET",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://2ingf1wro0.execute-api.us-west-1.amazonaws.com/v1?mode=direct",
          crossDomain: true,
          dataType: "json",
          success: function (data) {
            this._oView
              .getModel("mainModel")
              .setProperty("/directreports", data.result);
            this._oView
              .getModel("mainModel")
              .setProperty("/directReportsBusy", false);
            var skills = data.result.skils ? data.result.skils : "",
              aSkills = skills.split(", "),
              aSkillSet = [];
            aSkills.forEach((element) => {
              aSkillSet.push({ key: element, text: element });
            });
            this._oView
              .getModel("mainModel")
              .setProperty("/directreports/skillset", aSkillSet);
            this._oView
              .getModel("mainModel")
              .setProperty("/directreports/askills", aSkills);
          }.bind(this),
          error: function (error) {
            this._oView
              .getModel("mainModel")
              .setProperty("/directReportsBusy", false);
            console.log("Error fetching direct reports");
            // var sUrl =
            //   "https://mylightningstorage.auth.ap-south-1.amazoncognito.com/login?client_id=4khht0k2e1r2k5v3ei7hsp8smd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.mylightningstorage.com/";
            if (error.status === 401) {
              MessageToast.show("Error occured. Sign in again");
              window.sessionStorage.accessToken = "";
              sap.m.URLHelper.redirect(sUrl, false);
            }
          }.bind(this),
        });
      },
      _initOverviewModelBinding: function () {
        if (this._fromDirectReports) {
          this._fromDirectReports = false;
          this._getDirectReports();
        } else {
          this._oView.byId("colleaguesSearch").fireSearch();
        }
      },
      _onRouteMatched: function () {
        if (this._refresh) {
          this._refresh = false;
          jQuery.sap.delayedCall(1000, this, this._initOverviewModelBinding);
        }
      },
      onInvalidateOverview: function (sChannelId, sEventId, oData) {
        this._refresh = true;
        // execute the afterNavigate function (if present)
        if (oData.fnAfterNavigate) {
          oData.fnAfterNavigate();
        }
      },
      handleEditPhoto: function () {
        var oMainModel = this.getView().getModel("mainModel");
        oMainModel.setProperty("/photoError", false);
        oMainModel.setProperty("/photoSuccess", false);
        if (!this._oPhotoDialog) {
          this._oPhotoDialog = sap.ui.xmlfragment(
            this._oView.getId(),
            "aws.LightningStorage.view.Upload",
            this
          );
          this.attachControl(this._oPhotoDialog);
        }
        this._oPhotoDialog.open();
      },
      handleAfterClose: function () {
        this._oPhotoDialog.close();
      },
      formatURL: function (sUrl) {
        return sUrl ? sUrl : "https://d3fu3214bbcc0g.cloudfront.net/user.png";
      },
      attachControl: function (oControl) {
        var sCompactCozyClass = this.getOwnerComponent().getContentDensityClass();
        jQuery.sap.syncStyleClass(sCompactCozyClass, this.getView(), oControl);
        this.getView().addDependent(oControl);
      },
      handleUpdatePress: function (oEvent) {
        var oMainModel = this.getView().getModel("mainModel"),
          data = oMainModel.getData().employee;
        data.dob = new Date(data.dob);
        var oDateFormat = DateFormat.getDateInstance({
          style: "medium",
        });
        data.dob = oDateFormat.format(data.dob);
        data.skils = this._oView
          .byId("multiSkills")
          .getSelectedKeys()
          .join(", ");
        oMainModel.setProperty("/employeeBusy", true);
        $.ajax({
          type: "POST",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`
          },
          contentType: "application/json",
          url: "https://j7jnk6by86.execute-api.us-west-1.amazonaws.com/emp",
          crossDomain: true,
          dataType: "json",
          data: JSON.stringify(data),
          success: function (result) {
            // oMainModel.setProperty("/employees", data.result);
            MessageToast.show("Profile Updated Successfully");
            oMainModel.setProperty("/employeeBusy", false);
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty("/employeeBusy", false);
            if (error.status === 401) {
              window.sessionStorage.accessToken = "";
              MessageToast.show("Error occured. Sign in again");
              sap.m.URLHelper.redirect(sUrl, false);
            }
            // sap.m.URLHelper.redirect(sUrl, false);
          }.bind(this),
        });
      },
      onRejectRequest: function (oEvent) {
        var oBindingContext = oEvent.getSource().getParent().getBindingContext("mainModel"),
          oObject = oBindingContext.getObject(),
          oMainModel = this.getView().getModel("mainModel"),
          aRequests = oMainModel.getProperty("/adminrequests"),
          data = { emp_id: oObject.emp_id, requested_by: '' };
        oMainModel.setProperty("/adminRequestBusy", true);
        $.ajax({
          type: "POST",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://9hoankm1y3.execute-api.us-west-1.amazonaws.com/apr",
          crossDomain: true,
          dataType: "json",
          data: JSON.stringify(data),
          success: function (result) {
            var aNewRequests = [];
            aRequests.forEach(function (req) {
              if (req.emp_id !== data.emp_id) {
                aNewRequests.push(req);
              }
            });
            oMainModel.setProperty("/adminrequests", aNewRequests);
            MessageToast.show("Request rejected!");
            oMainModel.setProperty("/adminRequestBusy", false);
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty("/adminRequestBusy", false);
            if (error.status === 401) {
              window.sessionStorage.accessToken = "";
              MessageToast.show("Error occured. Sign in again");
              sap.m.URLHelper.redirect(sUrl, false);
            }
            //sap.m.URLHelper.redirect(sUrl, false);
          }.bind(this),
        });
      },
      onAcceptRequest: function (oEvent) {
        var oBindingContext = oEvent.getSource().getParent().getBindingContext("mainModel"),
          oObject = oBindingContext.getObject(),
          oMainModel = this.getView().getModel("mainModel"),
          aRequests = oMainModel.getProperty("/adminrequests"),
          data = { emp_id: oObject.emp_id, requested_by: oObject.requested_by };
        oMainModel.setProperty("/adminRequestBusy", true);
        $.ajax({
          type: "POST",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://9hoankm1y3.execute-api.us-west-1.amazonaws.com/apr",
          crossDomain: true,
          dataType: "json",
          data: JSON.stringify(data),
          success: function (result) {
            var aNewRequests = [];
            aRequests.forEach(function (req) {
              if (req.emp_id !== data.emp_id) {
                aNewRequests.push(req);
              }
            });
            oMainModel.setProperty("/adminrequests", aNewRequests);
            MessageToast.show("Request Accepted. Employee assigned to the requestor.");
            oMainModel.setProperty("/adminRequestBusy", false);
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty("/adminRequestBusy", false);
            if (error.status === 401) {
              window.sessionStorage.accessToken = "";
              MessageToast.show("Error occured. Sign in again");
              sap.m.URLHelper.redirect(sUrl, false);
            }
            //sap.m.URLHelper.redirect(sUrl, false);
          }.bind(this),
        });


      },
      onPress: function (oEvent) {
        var oLineItem = oEvent
          .getSource()
          .getBindingContext("mainModel")
          .getObject();
        this.getView()
          .getModel("newEmployee")
          .setProperty("/employee", oLineItem);
        var sTableId = oEvent.getSource().getParent().getId();
        if (sTableId.indexOf("table2") > -1) {
          this._fromDirectReports = true;
        } else {
          this._fromDirectReports = false;
        }
        if (
          this.getView().getModel("mainModel").getProperty("/employee/is_admin")
        ) {
          this.getView().getModel("newEmployee").setProperty("/ADMIN", true);
        } else {
          this.getView().getModel("newEmployee").setProperty("/ADMIN", false);
        }
        var skills = oLineItem.skils ? oLineItem.skils : "",
          aSkills = skills.split(", "),
          aSkillSet = [];
        aSkills.forEach((element) => {
          aSkillSet.push({ key: element, text: element });
        });
        this._oView
          .getModel("newEmployee")
          .setProperty("/employee/skillset", aSkillSet);
        this._oView
          .getModel("newEmployee")
          .setProperty("/employee/askills", aSkills);
        this.getView()
          .getModel("newEmployee")
          .setProperty(
            "/currentEmp",
            this.getView().getModel("mainModel").getProperty("/employee/emp_id")
          );
        this._oRouter.navTo("employee", {}, false);
      },
      handleDeletePhoto: function () {
        var oMainModel = this.getView().getModel("mainModel"),
          data = { photo_url: oMainModel.getProperty("/employee/photo_url") };
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
          url: "https://4ckgy4jh8c.execute-api.us-west-1.amazonaws.com/v1",
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
      sendBase64String: async function (oFile, fileSize, mimeType, fileName, oFileUploader) {
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

        var sBase64String = await toBase64(oFile);
        var data = {
          filename: fileName,
          base64String: sBase64String,
          mimeType: mimeType,
          fileSize: fileSize
        }
        var oMainModel = this.getView().getModel("mainModel");
        $.ajax({
          type: "POST",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "https://zlvydelo5b.execute-api.us-west-1.amazonaws.com/uploadPhoto",
          dataType: "json",
          data: JSON.stringify(data),
          success: function (data) {
            response = data.result;
            oMainModel.setProperty("/employee/photo_url", response.url);
            oFileUploader.setValue(null);
            oMainModel.setProperty(
              "/photoMsg",
              "Photo Uploaded Successfully"
            );
            oMainModel.setProperty("/photoSuccess", true);
            oMainModel.setProperty("/photoError", false);
            oMainModel.setProperty("/busyUpload", false);
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty(
              "/photoMsg",
              "An error occurred. Please retry."
            );
            oMainModel.setProperty("/photoError", true);
            oMainModel.setProperty("/photoSuccess", false);
            oMainModel.setProperty("/busyUpload", false);
            console.log("Error fetching files");
          }.bind(this),
        });
      },
      handleUploadPress: function (oEvent) {
        var oFileUploader = this._oView.byId("fileUploader"),
          oFile = oFileUploader.oFileUpload.files[0],
          oMainModel = this.getView().getModel("mainModel");

        const fileSize = oFile.size; //updated size
        const mimeType = oFile.mimetype;
        const fileName = oFile.name;
        if (oFile) {
          sendBase64String(oFile, fileSize, mimeType, fileName, oFileUploader);

          // var oUploadSet = this._oView.byId("UploadCollection"),
          // aUploadCollectionItems = oUploadSet.getItems(),
          oFileUploader.setBusy(true);
          // var sMode = "POST",
          //   sUrl = "/api/upload_photo",
          //   sFileName = "",
          //   currIndx = -1,
          //   prevUTime = "";
          // oMainModel.setProperty("/busyUpload", true);
          // var formData = new FormData(),
          //   currTime = Date.now().toString();

          // formData.append("utime", currTime);

          // // formData.append("fname", "Shivam");
          // // formData.append("lname", "Shrivastav");
          // // formData.append("utime", Date.now().toString());
          // formData.append("fileToUpload", oFile, oFile.name);
          // // formData.append("user_id", "s.s@gmail.com");
          // formData.append("ctime", currTime);
          // var params = {
          //   url: sUrl,
          //   timeout: 0,
          //   headers: {
          //     Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          //   },
          //   processData: false,
          //   method: sMode,
          //   mimeType: "multipart/form-data",
          //   contentType: false,
          //   data: formData,
          // };

          // $.ajax(params).done(function (response, success) {
          //   oFileUploader.setBusy(false);
          //   if (success === "success") {
          //     response = JSON.parse(response);
          //     oMainModel.setProperty("/employee/photo_url", response.url);
          //     oFileUploader.setValue(null);
          //     oMainModel.setProperty(
          //       "/photoMsg",
          //       "Photo Uploaded Successfully"
          //     );
          //     oMainModel.setProperty("/photoSuccess", true);
          //     oMainModel.setProperty("/photoError", false);
          //   } else {
          //     oMainModel.setProperty(
          //       "/photoMsg",
          //       "An error occurred. Please retry."
          //     );
          //     oMainModel.setProperty("/photoError", true);
          //     oMainModel.setProperty("/photoSuccess", false);
          //   }
          //   oMainModel.setProperty("/busyUpload", false);
          // });
        } else {
          MessageToast.show("Please choose a file to uploaded");
        }
      },
      // handleUploadPress: function (oEvent) {
      //   var oFileUploader = this._oView.byId("fileUploader"),
      //     oFile = oFileUploader.oFileUpload.files[0],
      //     oMainModel = this.getView().getModel("mainModel");
      //   if (oFile) {
      //     // var oUploadSet = this._oView.byId("UploadCollection"),
      //     // aUploadCollectionItems = oUploadSet.getItems(),
      //     oFileUploader.setBusy(true);
      //     var sMode = "POST",
      //       sUrl = "/api/upload_photo",
      //       sFileName = "",
      //       currIndx = -1,
      //       prevUTime = "";
      //     oMainModel.setProperty("/busyUpload", true);
      //     var formData = new FormData(),
      //       currTime = Date.now().toString();

      //     formData.append("utime", currTime);

      //     // formData.append("fname", "Shivam");
      //     // formData.append("lname", "Shrivastav");
      //     // formData.append("utime", Date.now().toString());
      //     formData.append("fileToUpload", oFile, oFile.name);
      //     // formData.append("user_id", "s.s@gmail.com");
      //     formData.append("ctime", currTime);
      //     var params = {
      //       url: sUrl,
      //       timeout: 0,
      //       headers: {
      //         Authorization: `Bearer ${window.sessionStorage.accessToken}`,
      //       },
      //       processData: false,
      //       method: sMode,
      //       mimeType: "multipart/form-data",
      //       contentType: false,
      //       data: formData,
      //       crossDomain: true
      //     };

      //     $.ajax(params).done(function (response, success) {
      //       oFileUploader.setBusy(false);
      //       if (success === "success") {
      //         response = JSON.parse(response);
      //         oMainModel.setProperty("/employee/photo_url", response.url);
      //         oFileUploader.setValue(null);
      //         oMainModel.setProperty(
      //           "/photoMsg",
      //           "Photo Uploaded Successfully"
      //         );
      //         oMainModel.setProperty("/photoSuccess", true);
      //         oMainModel.setProperty("/photoError", false);
      //       } else {
      //         oMainModel.setProperty(
      //           "/photoMsg",
      //           "An error occurred. Please retry."
      //         );
      //         oMainModel.setProperty("/photoError", true);
      //         oMainModel.setProperty("/photoSuccess", false);
      //       }
      //       oMainModel.setProperty("/busyUpload", false);
      //     });
      //   } else {
      //     MessageToast.show("Please choose a file to uploaded");
      //   }
      // },
      onEmployeeSearch: function (oEvent) {
        var sSearchText = oEvent.getParameter("query");
        sSearchText = sSearchText ? sSearchText : oEvent.getSource().getValue();
        var oSwitch = this._oView.byId("switch"),
          sAvailable = oSwitch.getSelectedKey(),
          oMainModel = this.getView().getModel("mainModel");
        oMainModel.setProperty("/employeesBusy", true);
        //         this._oView.setModel(oMainModel, "mainModel");
        $.ajax({
          type: "GET",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url:
            "https://uv0wj5r7hj.execute-api.us-west-1.amazonaws.com/v1?query=" + sSearchText + "&available=" + sAvailable,
          dataType: "json",
          crossDomain: true,
          success: function (data) {
            oMainModel.setProperty("/employees", data.result);
            oMainModel.setProperty("/employeesBusy", false);
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty("/employeesBusy", false);
            if (error.status === 401) {
              window.sessionStorage.accessToken = "";
              MessageToast.show("Error occured. Sign in again");
              sap.m.URLHelper.redirect(sUrl, false);
            }
            sap.m.URLHelper.redirect(sUrl, false);
          }.bind(this),
        });
      },
      onDirectTableUpdateFinished: function (oEvent) {
        var sTitle,
          oList = oEvent.getSource(),
          iTotalItems = oEvent.getParameter("total");
        // only update the counter if the length is final and
        // the list is not empty
        if (iTotalItems && oList.getBinding("items").isLengthFinal()) {
          sTitle = "Direct Reportees (" + iTotalItems + ")";
        } else {
          sTitle = "";
        }
        this.getView()
          .getModel("mainModel")
          .setProperty("/totalDirectReports", sTitle);
      },
      onColleaguesTableUpdateFinished: function (oEvent) {
        var sTitle,
          oList = oEvent.getSource(),
          iTotalItems = oEvent.getParameter("total");
        // only update the counter if the length is final and
        // the list is not empty
        if (iTotalItems && oList.getBinding("items").isLengthFinal()) {
          sTitle = "Employees Found (" + iTotalItems + ")";
        } else {
          sTitle = "";
        }
        this.getView()
          .getModel("mainModel")
          .setProperty("/totalEmployees", sTitle);
      },
      onRequestTableUpdateFinished: function (oEvent) {
        var sTitle,
          oList = oEvent.getSource(),
          iTotalItems = oEvent.getParameter("total");
        // only update the counter if the length is final and
        // the list is not empty
        if (iTotalItems && oList.getBinding("items").isLengthFinal()) {
          sTitle = "Requests (" + iTotalItems + ")";
        } else {
          sTitle = "";
        }
        this.getView()
          .getModel("mainModel")
          .setProperty("/totalAdminRequests", sTitle);
      },
      onFileDeleted: function (oEvent) {
        var sDocId = oEvent.getParameter("documentId"),
          oMainModel = this._oView.getModel("mainModel"),
          aItems = oMainModel.getProperty("/items");

        // var sUserId = "s.s@gmail.com";
        var data = {
          // user_id: sUserId,
          filename: oEvent.getParameter("documentId"),
        };
        oMainModel.setProperty("/busyDelete", true);
        $.ajax({
          type: "DELETE",
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          },
          contentType: "application/json",
          url: "/api/delete_file",
          crossDomain: true,
          dataType: "json",
          data: JSON.stringify(data),
          success: function (data) {
            jQuery.each(aItems, function (index) {
              if (aItems[index] && aItems[index].filename === sDocId) {
                aItems.splice(index, 1);
              }
            });
            oMainModel.setProperty("/items", aItems);
            oMainModel.setProperty("/busyDelete", false);
            MessageToast.show("File deleted successfully");
          }.bind(this),
          error: function (error) {
            oMainModel.setProperty("/busyDelete", false);
            console.log("Error fetching files");
          }.bind(this),
        });
      },
      onEmail: function (oEvent) {
        var sValue = oEvent.getSource().getText();
        sap.m.URLHelper.triggerEmail(sValue);
      },
      onPhone: function (oEvent) {
        var sValue = oEvent.getSource().getText();
        sap.m.URLHelper.triggerTel(sValue);
      },
      onFileSizeExceed: function (oEvent) {
        MessageToast.show("Max. 10 MB size allowed");
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
      onLogoutPress: function () {
        window.sessionStorage.accessToken = "";
        // window.location.replace("");
        sap.m.URLHelper.redirect(sLogOutUrl, false);
      },
      formatFilename: function (fileName) {
        var sFileName = fileName;
        if (fileName) {
          var strtInx = fileName.indexOf("-");
          sFileName = fileName.substr(strtInx + 1);
        }
        return sFileName;
      },
      formatTime: function (time) {
        var sTimestamp = "";
        if (time) {
          var timestamp = parseInt(time),
            oDate = new Date(timestamp);
          sTimestamp = oDate.toDateString() + " " + oDate.toLocaleTimeString();
        }
        return sTimestamp;
      },
      formatSize: function (size) {
        var sSize = "";
        if (size) {
          var fileSizeExt = ["Bytes", "KB", "MB", "GB"],
            i = 0;
          while (size > 900) {
            size /= 1024;
            i++;
          }
          sSize = Math.round(size * 100) / 100 + " " + fileSizeExt[i];
        }
        return sSize;
      },
      onHomeIconPress: function () {
        window.location.replace("");
      },
      onPhotoChange: function (oEvent) {
        var oFileUploader = this._oView.byId("fileUploader");
        oFileUploader.setName("abc");
      },
      handleLinkedInImport: function () {
        var oMainModel = this._oView.getModel("mainModel");
        var sUrl =
          "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86grngv21de7bq&redirect_uri=https://master.d1l8csbyyor94c.amplifyapp.com/&scope=r_liteprofile%20r_emailaddress%20w_member_social";
        // window.open(sUrl, "window", "toolbar=no, menubar=no, resizable=yes");
        var child = window.open(
          sUrl,
          "window",
          "toolbar=no, menubar=no, resizable=yes"
        );
        var timer = setInterval(checkChild, 500);

        function checkChild() {
          if (child.closed) {
            var data = {
              linkedin_token: window.sessionStorage.linkedin_code_1,
            };
            if (!window.sessionStorage.linkedin_code_1) {
              return;
            }
            oMainModel.setProperty("/photoBusy", true);
            $.ajax({
              type: "POST",
              headers: {
                Authorization: `Bearer ${window.sessionStorage.accessToken}`,
              },
              contentType: "application/json",
              url: "https://3oupc4lzn0.execute-api.us-west-1.amazonaws.com/linkedin",
              crossDomain: true,
              dataType: "json",
              data: JSON.stringify(data),
              success: function (data) {
                // oMainModel.setProperty("/employees", data.result);
                var sPhotoUrl =
                  data.result.profilePicture["displayImage~"].elements[2]
                    .identifiers[0].identifier;
                oMainModel.setProperty("/employee/photo_url", sPhotoUrl);
                MessageToast.show("Profile picture imported Successfully");
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

            clearInterval(timer);
          }
        }
      },
    });
  }
);
