const dappIdentityId = '8FDzB5kcpXtFQcWACXck2akHHG4nR9G4mP6gqPBGZVSi';    // todo, fetch from mnemonic when dashjs support
const messageContractId = 'B5tT3N8cVjo7bC9yNh3LGKjbvQhWDN6MGHog4oinwLMn'; // static "message contract", can be exchanged with Push-Notification-service later
const dpnsContractID = "FiBkhut4LFPMJqDWbZrxVeT6Mr6LsH3mTNTSSHJY2ape";
var client = null;
var docID = '';
var identityID = '';
var clientOpts = {};

$(document).ready(function () {
    console.log("doc ready")

    var storageUsername = sessionStorage.getItem('dash_username');
    if (storageUsername != null) {
        $("#inputUsername").val(storageUsername)
    }

    $("#submitBtn").click(async function () {

        console.log("click")

        var inputUsername = $("#inputUsername").val();
        $("#submitBtn").prop('disabled', true);

        // Submit a document ("Request Document ST") to the Users Wallet
        clientOpts = {};
        clientOpts.wallet = {};
        clientOpts.wallet.mnemonic = 'velvet timber under input escape rich gauge final submit burst glow garage';
        var clientApps = '{ "myContract" : { "contractId" : "' + messageContractId + '" } }';
        clientApps = JSON.parse(clientApps);
        clientOpts.apps = clientApps;

        client = new Dash.Client(clientOpts);

        console.log("submit Request Document ST")
        const submitMessageDocument = async function () {

            try {
                const identity = await client.platform.identities.get(dappIdentityId);  // dapp identity

                // create document
                docProperties = {
                    header: 'Request Document ST',
                    dappname: 'Simple Browser Dapp',
                    reference: inputUsername,
                    status: '0',
                    timestamp: new Date().toUTCString(),
                    STcontract: messageContractId,
                    STdocument: 'message',
                    STcontent: '{ "header" : "Response Login", "dappname" : "Simple Browser Dapp", "reference" : "' + inputUsername + '", "STcontract" : "' + messageContractId + '", "STdocument" : "message" }',
                }

                // Create the note document
                const messageDocument = await client.platform.documents.create(
                    'myContract.message',
                    identity,
                    docProperties,
                );

                const documentBatch = {
                    create: [messageDocument],
                    replace: [],
                    delete: [],
                }

                // Sign and submit the document
                await client.platform.documents.broadcast(documentBatch, identity);
            } catch (e) {
                console.error('Something went wrong:', e);
            } finally {
                console.log("submited Request Document ST for user: " + inputUsername)
                client.disconnect();
            }
        };
        await submitMessageDocument();


        // get identity ID for user
        console.log("fetch identity ID from username")
        async function getIdentityID() {
            clientApps = '{ "myContract" : { "contractId" : "' + dpnsContractID + '" } }';
            clientApps = JSON.parse(clientApps);
            clientOpts.apps = clientApps;

            var recordLocator = "myContract.domain";
            var queryObject = '{ "where": [' +
                '["normalizedParentDomainName", "==", "dash"],' +
                '["normalizedLabel", "==", "' + inputUsername + '"]' +
                '],' +
                '"startAt": 1 }';

            try {
                client = new Dash.Client(clientOpts);

                var queryJson = JSON.parse(queryObject);
                const documents = await client.platform.documents.get(recordLocator, queryJson);
                console.log(documents)
                if (documents[0] == null || documents[0] == undefined) {
                    console.log("Couldnt connect to network, aborting polling! Please try again in a few moments.");
                } else {
                    console.log("DocumentID for user " + inputUsername + ": " + documents[0].id)
                    console.log("Identity for user " + inputUsername + ": " + documents[0].ownerId)
                    docID = documents[0].id
                    identityID = documents[0].ownerId
                    console.log("saved Identity ID")
                }
            } catch (e) {
                console.error('Something went wrong:', e);
            } finally {
                client.disconnect()
            }
        }
        await getIdentityID();


        console.log("start polling for Response Login")
        async function polling() {
            clientApps = '{ "myContract" : { "contractId" : "' + messageContractId + '" } }';
            clientApps = JSON.parse(clientApps);
            clientOpts.apps = clientApps;

            var recordLocator = "myContract.message";
            var queryObject = '{ "startAt" : "' + 1 + '" }';
            var queryJson = JSON.parse(queryObject);

            try {
                client = new Dash.Client(clientOpts);

                const allDocuments = await client.platform.documents.get(recordLocator, queryJson);
                var nStart = allDocuments.length;

                var i = 1
                while (i < 180) {
                    console.log(nStart)
                    queryObject = '{ "startAt" : "' + nStart + '" }';
                    queryJson = JSON.parse(queryObject);
                    var newDocuments = await client.platform.documents.get(recordLocator, queryJson);
                    console.log(newDocuments)
                    console.log(newDocuments.length)

                    if (newDocuments.length >= 1 && newDocuments[0].ownerId == identityID && newDocuments[0].data.reference == inputUsername) {
                        console.log("Received valid Response Login document")
                        return true;
                    }
                    await new Promise(r => setTimeout(r, 1500));  // sleep x ms
                    if (newDocuments.length >= 1)
                        nStart++;
                    i++;
                }
                return false;

            } catch (e) {
                console.error('Something went wrong:', e);
            } finally {
                client.disconnect()
            }
        }
        var response = await polling();
        console.log("response: " + response)

        if (response) {
            sessionStorage.setItem('dash_username', $("#inputUsername").val());
            console.log("username set: " + $("#inputUsername").val())
            window.location.href = "./index.html";
        }

        $("#submitBtn").prop('disabled', false);
        console.log("done")

    });


});