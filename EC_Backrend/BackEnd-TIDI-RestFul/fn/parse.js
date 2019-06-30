var Parse = require("parse/node");

Parse.initialize("yf0epfCPMF1RxeR3kc6VdpDFb2qpE7pQgpLiGsG7", "Lh1WCK66TzgUR80NhQ736NQvOrzil2cWhZnyU4XY"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

var client = new Parse.LiveQueryClient({
    applicationId: "yf0epfCPMF1RxeR3kc6VdpDFb2qpE7pQgpLiGsG7",
    serverURL: "wss://sang.back4app.io", // Example: 'wss://livequerytutorial.back4app.io'
    javascriptKey: "Lh1WCK66TzgUR80NhQ736NQvOrzil2cWhZnyU4XY",
    masterKey: "OzV3QnIefjbn14kyEEVMcOQs2o7kxWNSk0I6SW7e"
});
client.open();

module.exports.LiveQueryClient = client;
module.exports.Parse = Parse;
