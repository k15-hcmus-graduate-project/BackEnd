var Parse = require("parse/node");

Parse.initialize("1V73PQUeskvatsPQazkKEEQdbVsQ5lsKb77UHoQI", "iDKJ337CYJ80XjUOy8SIp2WTtPq0q56154kadxaO"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

var client = new Parse.LiveQueryClient({
    applicationId: "1V73PQUeskvatsPQazkKEEQdbVsQ5lsKb77UHoQI",
    serverURL: "wss://tidi.back4app.io", // Example: 'wss://livequerytutorial.back4app.io'
    javascriptKey: "iDKJ337CYJ80XjUOy8SIp2WTtPq0q56154kadxaO",
    masterKey: "HMhA16lGsuVRT5rYaEkTtAvUhStKDjNmjE1WR3E8"
});
client.open();

module.exports.LiveQueryClient = client;
module.exports.Parse = Parse;
