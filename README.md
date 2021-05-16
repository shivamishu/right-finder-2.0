
# Right Finder 2.0: Serverless Progressive Web App   
**Team Name**: Cloud Bond  
**Team Members**: Shivam Shrivastav, Praveen Nayak, Kunjan Malik, Yadnyshree Savant  
**Repository Link**: https://github.com/shivamishu/right-finder-2.0  
**App URL**: https://master.d1l8csbyyor94c.amplifyapp.com/  
**Demo PPT**:
https://drive.google.com/file/d/1ZTAYQDejhSN8L98tCaqwqc9B2sjkySE5/view?usp=sharing

![image](https://user-images.githubusercontent.com/70448345/118405402-683ad300-b695-11eb-8712-98de9c8a6d27.png)

![image](https://user-images.githubusercontent.com/24988178/118391798-03c33980-b5eb-11eb-9221-b0c894bfb337.png)


## Application Use cases:
RightFinder application would help find employee details such as skills, contact information, department details, designation , direct reportees etc.   
RightFinder will provide employees to view their basic official and confidential information based on user roles  
RightFinder has the capability of social media integration with LinkedIn to Import profile pictures.  
RightFinder will enable in identifying the employees who are idle(available) with the right skillset  

# Application Workflow : 
             Admin View: 
                   View and update his/her own profile with confidential details.
                   Import profile picture from LinkedIn Profile.
                   Search for employees who are not yet assigned to any manager.
                  Assign employees to a particular manager.
                  Approve and reject the request from the manager for an employee to be onboarded.
            
           Manager View:
                    View and update his/her own profile with confidential details.
                    Import profile picture from LinkedIn Profile.
                    View and Update his/her direct reportees basic and confidential details.
                    Mark his reportees as available for new assignments.
                    Search within the company for the skill sets which are readily available for new role.
                    Request admin to approve an onboard available employee.
          Employee View:
                    View and update his/her own profile.
                    Import profile picture from LinkedIn Profile.
                    Search for any employee and view basic employee details.
                    
                    
         
         
  **It’s a serverless Application deployed on AWS Amplify with below Architecture**:   
![image](https://user-images.githubusercontent.com/70448345/118405428-80aaed80-b695-11eb-8b01-103286e74a32.png)



  ![Screen Shot 2021-05-16 at 7 29 54 AM](https://user-images.githubusercontent.com/68475402/118404510-1740c580-b628-11eb-8545-2cb804d78f4b.png)

                    
                    
# AWS and Other Resources: 

● AWS Lambda: Application is serverless using lambda functions and all the UI calls are going through API gateway to Lambda functions.  
API Gateway Lambda Function APIs:  
https://2ingf1wro0.execute-api.us-west-1.amazonaws.com/v1  
https://4ckgy4jh8c.execute-api.us-west-1.amazonaws.com/v1  
https://ymetjn3mfa.execute-api.us-west-1.amazonaws.com/empRequest  
https://j7jnk6by86.execute-api.us-west-1.amazonaws.com/emp  
https://2ingf1wro0.execute-api.us-west1.amazonaws.com/v1  
https://j7jnk6by86.execute-api.us-west-1.amazonaws.com/emp  
https://9hoankm1y3.execute-api.us-west-1.amazonaws.com/apr  
https://9hoankm1y3.execute-api.us-west-1.amazonaws.com/apr  
https://uv0wj5r7hj.execute-api.us-west-1.amazonaws.com/v1  

● S3: S3 (with Standard S3 storage class) is used to store employee images.  

● CloudFront: We used Amazon CloudFront to reduce the unnecessary traffic back to S3
origin to help improve latency as well as reduce load on the origin. It caches our content
and provides faster access globally.   
● Transfer Acceleration for S3 Bucket: Transfer Acceleration will take advantage of its
globally distributed edge locations. When the data arrives at the nearest edge location, it
is routed to automatically internally by Amazon S3 over an optimized network path.  
● RDS: All the user database is stored here and connected to Tableau for analytics.  Currently using RDS on MySQL engine.    
● CloudWatch: It is used to log and monitor Lambda Functions.  SNS is used for sending various above notifications using messages, emails and logs.    
● Amazon Cognito: We have created a user pool for all our admin users to accommodate the access to application and APIs using Cognito Hosted UI for sign and sign up using 2FA and also added social identity providers like Facebook.  
● Third Party Integration: We used LinkedIn for third party integration, where an employee could import his profile picture from his/her LinkedIn Profile.  
● AWS Amplify: Frontend of the app is deployed on AWS Amplify, which provides automatic CI/CD pipeline.  
● Tableau: Integrating with Tableau to track skill sets and check employee availability for a particular skill set.  
● Used OpenUI5 with bootstrap to build UI. It is an open source Model View Controller based JavaScript Framework. For Backend, we used NodeJS.  
![image](https://user-images.githubusercontent.com/70448345/118405454-a1734300-b695-11eb-9e8c-e44d0df99277.png)



**List of Softwares used**:  
● Visual Studio Code   
● AWS CLI   
● Various NodeJS npm packages can be downloaded using command npm i --s  
● MySQL Workbench  
● Git  
● Tableau  

**Tech Stack**:  
REST API - Profile details, Search Employee, Social media: **NodeJS / AWS Lambda /AWS API Gateway**  
SSO / Authorizations: **AWS Cognito** 
UI: **OpenUI5**  
Content management - Store profile picture: **AWS S3 / CloudFront**  
Report Generation: **Tableau**  
CI/CD: **AWS Amplify** 
Data Persistence: **AWS RDS**  

**Setup and run project**:  
There is no setup required to run the application. You can directly use the below app or you can fork the Git repo and add it to AWS Amplify to host the new app.  
App URL: https://master.d1l8csbyyor94c.amplifyapp.com/
![image](https://user-images.githubusercontent.com/70448345/118405476-ba7bf400-b695-11eb-8965-fa6fbebee6d5.png)


