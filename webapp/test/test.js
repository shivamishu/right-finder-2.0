let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = chai.expect
const baseUrl = "https://2ingf1wro0.execute-api.us-west-1.amazonaws.com"
let token = "";
let should = chai.should();




chai.use(chaiHttp);






describe('Employee allocation request', () => {
    it('Employee allocation request', (done) => {

    	 let data = {"employee_id":"andrew.bond@gmail.com"}
        chai.request('https://ymetjn3mfa.execute-api.us-west-1.amazonaws.com').post('/empRequest')
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send({"employee_id":"andrew.bond@gmail.com"})
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});

describe('Approve allocation request', () => {
    it('Approve allocation request', (done) => {

    	 let data = {"emp_id":"andrew.bond@gmail.com"}
        chai.request('https://9hoankm1y3.execute-api.us-west-1.amazonaws.com').post('/apr')
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send({"emp_id":"alowe@rightfind.com","requested_by": "yadnyshree@gmail.com"})
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});


describe('Reject allocation request', () => {
    it('Reject allocation request', (done) => {

    	 let data = {"emp_id":"andrew.bond@gmail.com"}
        chai.request('https://9hoankm1y3.execute-api.us-west-1.amazonaws.com').post('/apr')
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send({"emp_id":"alowe@rightfind.com","requested_by": "yadnyshree@gmail.com"})
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});

describe('Get the Manager id', () => {
    it('It should get the Manager id', (done) => {
        chai.request(baseUrl).get('/v1?mode=mgr').set("Authorization", "Bearer " + token).end((err, res) => {
            res.should.have.status(200);

           
            done();
        });
    });
});




describe('Get the employee  info', () => {
    it('It should get employee info', (done) => {
        chai.request('https://j7jnk6by86.execute-api.us-west-1.amazonaws.com').get('/emp').set("Authorization", "Bearer " + token).end((err, res) => {
            res.should.have.status(200);
            
            done();
        });
    });
});


describe('Get the employee  allocation request', () => {
    it('It should retreive the employee allocation request', (done) => {
        chai.request(baseUrl).get('/v1?mode=admin_requests').set("Authorization", "Bearer " + token).end((err, res) => {
            res.should.have.status(200);
            
            done();
        });
    });
});



describe('Get the employee  under admin ', () => {
    it('It should get employees under admin', (done) => {
        chai.request(baseUrl).get('/v1?mode=admin').set("Authorization", "Bearer " + token).end((err, res) => {
            res.should.have.status(200);
            
            done();
        });
    });
});



describe('Get the direct reportees for a Manager ', () => {
    it('It should get the direct reportees', (done) => {
        chai.request(baseUrl).get('/v1?mode=direct').set("Authorization", "Bearer " + token).end((err, res) => {
            res.should.have.status(200);
            
            done();
        });
    });
}); 


describe('Search employees ', () => {
    it('It should Search employees', (done) => {
        chai.request('https://uv0wj5r7hj.execute-api.us-west-1.amazonaws.com').get('/v1?query=a&available=Yes').set("Authorization", "Bearer " + token).end((err, res) => {
            res.should.have.status(200);
            
            done();
        });
    });
});



describe('New request', () => {
    it('New request', (done) => {

    	 let data = {
    "emp_id": "yadnyshree@gmail.com",
    "name": "Yadnyshree Savant",
    "dob": "Dec 6, 1992",
    "gender": "Male",
    "mgr_id": "dan.harkey@gmail.com",
    "dept_name": "CMPE272",
    "position": "Senior Developer",
    "photo_url": "https://media-exp1.licdn.com/dms/image/C5103AQEaionFk__EQA/profile-displayphoto-shrink_400_400/0/1530545062818?e=1625097600&v=beta&t=szPUpaB943vDw1KZRFJ-PdO_vLyquT1qXtIVODnn3Js",
    "salary": "$155000",
    "location": "San Francisco Bay Area",
    "contact": "+1 6692136296",
    "skils": "ReactJS, NodeJS,  Java, DevOps, AWS, Architecture",
    "available": "No",
    "available_since": null,
    "is_mgr": 0,
    "is_admin": 1,
    "requested_by": null,
    "skillset": [
        {
            "key": "ReactJS",
            "text": "ReactJS"
        },
        {
            "key": "Java",
            "text": "Java"
        },
        
        {
            "key": "DevOps",
            "text": "DevOps"
        },
        {
            "key": "AWS",
            "text": "AWS"
        },
        {
            "key": "Architecture",
            "text": "Architecture"
        }
    ],
    "askills": [
        "ReactJS",
        "NodeJS",
        
        "Java",
       
        "DevOps",
        "AWS",
        "Architecture",
        
    ]
}
        chai.request('https://j7jnk6by86.execute-api.us-west-1.amazonaws.com').post('/emp')
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send(data)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});





