# S3endpoints
This repo has express end points which help browser to upload/download files directly<br/>

When browser needs to upload/download a file, it will always good to upload directly from the browser instead of 
 sending the file to the middle server like node.js and then upload it to the S3, If we need to upload/download files
 directly from browser we need to expose S3 keys to the browser which is not good, 
 so these API act as a wrapper to hide the keys, these will generate a signed url everytime when browser wants to do an operation
 which only be alive certain seconds.<br/>
 
 
Please check https://github.com/leelakrishnak/S3DragDropButton react UI componet for the browser usage.
 
 <br/>How to run the app<br/>
 # yarn install
 # yarn start




 /**
 * Make sure you have s3_config.json file with following s3 credentials
 * before running the app
 * {
 * accessKeyId: xxxx,
 * secretAccessKey: xxxx,
 * region: xxxx
 * }

 
 
 
