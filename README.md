**Team Name**: Cloud Bond


**Team Members**: Shivam Shrivastav, Praveen Nayak, Kunjan Malik, Yadnyshree Savant


**Repository Iink**: 


**Application demo Video Link**: 


**Application Link**: 








**Application Use Cases:**
RightFinder application would help find employee details such as skills, contact information, department details, designation , direct reportees etc. 
RightFinder will provide employees to view their basic official and confidential information based on user roles
RightFinder has the capability of social media integration with LinkedIn to Import profile pictures.
RightFinder will enable in identifying the employees who are idle(available) with the right skillset

RightFinder application has been migrated from EC2 compute to AWSLambda server less. 
Verson1 : https://github.com/sjsu-cmpe272/RightFinder 
Verson2 : 

**Application Workflow** : 


            Admin View: 
                   View and update his/her own profile with confidential details.
                   Import profile picture from LinkedIn Profile.
                   Search for employees who are not yet assigned to any manager.
                   Assign employees to a particular manager.
                   Approve or Reject the request from manager for a team member to be onboarded based on the project demand.
            
           Manager View:
                    View and update his/her own profile with confidential details.
                    Import profile picture from LinkedIn Profile.
                    View and Update his/her direct reportees basic and confidential details.
                    Mark his reportees as available for new assignments.
                    Search within the company for the skill sets which are readily available for new role.
                    Request admin to approve an available employee to be onboarded to the team.
          Employee View:
                    View and update his/her own profile.
                    Import profile picture from LinkedIn Profile.
                    Search for any employee and view basic employee details.

**Application is hosted on AWS platform with below Architecture**: 



● Amplify: It is categorized as Application Release Orchestration to support frontend code deployment with Git-based workflow.


● AWS Lamda: AWS Lambda automatically runs your code without requiring you to provision or manage infrastructure.It also automatically scales application by running code in response to each event.


● S3: S3 (with Standard S3 storage class) is used to store employee images


● Cross Region Data Replication: To implement DR, we have used Data Replication of S3 to have Cross Region Replication accommodating fault tolerance. We could also use Disaster Recovery for fault tolerance.


● CloudFront: We used Amazon CloudFront to reduce the unnecessary traffic back to S3 origin to help improve latency as well as reduce load on the origin. It caches our content and provides faster access globally. 


● Transfer Acceleration for S3 Bucket: Transfer Acceleration will take advantage of itsglobally distributed edge locations. When the data arrives at the nearest edge location, it is routed to automatically internally by Amazon S3 over an optimized network path.


● RDS: All the user database is stored here and connected to Tableau for analytics. Currently using RDS on MySQL engine.


● CloudWatch: It is used to log and monitor the auto scaling, EC2,S3 bucket logs etc SNS is used for sending various above notifications using messages, emails and logs.


● Amazon Cognito: We have created a user pool for all our admin users to accommodate the access to application and APIs using Cognito Hosted UI for sign and sign up using 2FA and also added social identity providers like Facebook.


● Third Party Integration: We used LinkedIn for third party integration, where employee could import his profile picture from his/her LinkedIn Profile.


● Tableau: Integrating with Tableau to track skill sets and check employee availability for a particular skill set.


● Used OpenUI5 with bootstrap to build UI. It is an open source Model View Controller based JavaScript Framework. For Backend, we used NodeJS.


**List of Softwares downloaded locally**:


● Visual Studio Code


● various nodejs packages can be downloaded using command npm i --s


● Mysql workbench


● git


● Tableau



**Setup and run project locally** :


● Clone the repository: 


● run cmd commands:


       
