// mydapp identityid: DX66EJdogM6c2yG6ULTZYCzoqqRBm64XHuU42YbSK9tu
// Message {
//   contract: DataContract {
//     id: '6ow8zziDutSZP778QE88gWkyB2T9H7rdQaKXwUF2Fman',
//     ownerId: 'DX66EJdogM6c2yG6ULTZYCzoqqRBm64XHuU42YbSK9tu',
//     schema: 'https://schema.dash.org/dpp-0-4-0/meta/data-contract',
//     documents: {
//       message: {
//         properties: {
//           header: { type: 'string' },
//           dappname: { type: 'string' },
//           reference: { type: 'string' },
//           status: { type: 'string' },
//           timestamp: { type: 'string' },
//           STcontract: { type: 'string' },
//           STdocument: { type: 'string' },
//           STcontent: { type: 'string' },
//           TXaddr: { type: 'string' },
//           TXamount: { type: 'string' },
//           STraw: { type: 'string' },
//           TXraw: { type: 'string' }
//         },
//         additionalProperties: false
//       }
//     },
//     definitions: {},
//     entropy: 'yhPzNWNQzqwdStKz42t4A57XNvn1DYPjY4'
//   }
// }

// Note {
//   contract: DataContract {
//     id: '6WqEuw8KqX9fTh7eEa9qNPKHkgPi9hv2BWQXHTSHiwwe',
//     ownerId: 'DX66EJdogM6c2yG6ULTZYCzoqqRBm64XHuU42YbSK9tu',
//     schema: 'https://schema.dash.org/dpp-0-4-0/meta/data-contract',
//     documents: {
//       note: {
//         properties: {
//           date: { type: 'string' },
//           title: { type: 'string' },
//           message: { type: 'string' },
//           encrypted: { type: 'boolean' }
//         },
//         additionalProperties: false
//       }
//     },
//     definitions: {},
//     entropy: 'yN7k73qCocnuMxA42JDGJckquqXNGAdQWZ'
//   }
// }

var dappIdentityId = 'DX66EJdogM6c2yG6ULTZYCzoqqRBm64XHuU42YbSK9tu';    // todo, fetch from mnemonic when dashjs support
var messageContractId = '6ow8zziDutSZP778QE88gWkyB2T9H7rdQaKXwUF2Fman';
var noteContractId = '6WqEuw8KqX9fTh7eEa9qNPKHkgPi9hv2BWQXHTSHiwwe';

$(document).ready(function () {

    let username = sessionStorage.getItem('dash_username');
    if (username != null) {
        $("#signinbutton").removeClass('btn-success').addClass('btn-info');
        $("#signinbutton").val(username)
    }

    $("#exampleFormControlDate").val(new Date().toUTCString());

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

        const submitNoteDocument = async function () {

            try {
                const identity = await client.platform.identities.get(dappIdentityId);  // dapp identity

                //// dapp signing simple
                docProperties = {
                    header: 'Request Document ST',
                    dappname: 'Simple Browser Dapp',
                    reference: username,
                    status: '0',
                    timestamp: new Date().toUTCString(),
                    STcontract: noteContractId,
                    STdocument: 'note',
                    // STcontent: '{ "date" : "' + $("#exampleFormControlDate").val() + '", "title" : "' + $("#exampleFormControlTitle").val() + '", "message" : "' + $("#exampleFormControlTextarea").val() + '", "encrypted" : "' + $("#exampleCheck").prop('checked') + '"}'
                    STcontent: '{ "date" : "' + $("#exampleFormControlDate").val() + '", "title" : "' + $("#exampleFormControlTitle").val() + '", "message" : "' + $("#exampleFormControlTextarea").val() + '"}'
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
                console.log("submited Note document with message: " + $("#exampleFormControlTextarea").val())
                client.disconnect();
            }
        };
        await submitNoteDocument();
        $("#submitBtn").prop('disabled', false);
        console.log("done")

    });
});