var dappIdentityId = 'DX66EJdogM6c2yG6ULTZYCzoqqRBm64XHuU42YbSK9tu';
var messageContractId = '6ow8zziDutSZP778QE88gWkyB2T9H7rdQaKXwUF2Fman';
var dappAddress = 'yM8bRVwE3bQmqrnvG1oSpyXky2gjGErR5a'

$(document).ready(function () {

    let username = sessionStorage.getItem('dash_username');
    if (username != null) {
        $("#signinbutton").removeClass('btn-success').addClass('btn-info');
        $("#signinbutton").val(username)
    }

    $("#exampleFormControlUser").val(dappAddress)

    $("#submitBtn").click(async function () {
        console.log("click")
        $("#submitBtn").prop('disabled', true);

        var clientOpts = {};
        clientOpts.network = 'testnet';
        clientOpts.wallet = {};
        clientOpts.wallet.mnemonic = 'velvet timber under input escape rich gauge final submit burst glow garage';
        var curApps = '{ "messageContract" : { "contractId" : "' + messageContractId + '" } }';
        curApps = JSON.parse(curApps);
        clientOpts.apps = curApps;

        const client = new Dash.Client(clientOpts);

        const submitTransactionDocument = async function () {

            try {
                const identity = await client.platform.identities.get(dappIdentityId);  // dapp identity

                //// dapp signing simple
                docProperties = {
                    header: 'Request Transaction TX',
                    dappname: 'Simple Browser Dapp',
                    reference: username,
                    status: '0',
                    timestamp: new Date().toUTCString(),
                    TXaddr: dappAddress,
                    TXamount: $("#exampleFormControlAmount").val(),
                }

                // Create the note document
                const noteDocument = await client.platform.documents.create(
                    'messageContract.message',
                    identity,
                    docProperties,
                );

                const documentBatch = {
                    create: [noteDocument],
                    replace: [],
                    delete: [],
                }

                // Sign and submit the document
                await client.platform.documents.broadcast(documentBatch, identity);
            } catch (e) {
                console.error('Something went wrong:', e);
            } finally {
                console.log("submited Transaction Request with amount and address: " + $("#exampleFormControlAmount").val() + " Dash to " + $("#exampleFormControlUser").val())
                client.disconnect();
            }
        };
        await submitTransactionDocument();
        $("#submitBtn").prop('disabled', false);
        console.log("done")

    });
});