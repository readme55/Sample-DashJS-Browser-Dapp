let submitBtn = document.getElementById('submitBtn');
let submitText = document.getElementById('submitText');
// let submitText = document.getElementById('submitText');
// let submitText = document.getElementById('submitText');
// let submitText = document.getElementById('submitText');

// Mnemonic: toddler repair print phrase crouch curve charge typical swap bachelor outer upgrade
// { user identity: 'DUxf95cCdPTor7BfWMXmr2VmHQqdKMPQv6fauecy7Wuy' }
// name: dappuser
// identityID used for the messageContract:
// { identity: '14c3vc1qdsCgfPNVkxnZuJJyibAx4aQGsQPtUhkrStVt' }
// contractID: mA1kafwtR8HGoZamz72fmUWGGXKjDFLqmirtZbJYYoT

submitBtn.addEventListener('click', function () {
  console.log("click")
  submitBtn.disabled = true;

  const clientOpts = {
    network: 'testnet',
    mnemonic: 'grid bind gasp long fox catch inch radar purchase winter woman cactus',
    apps: {
      messageContract: {
        contractId: 'mA1kafwtR8HGoZamz72fmUWGGXKjDFLqmirtZbJYYoT'
      }
    }  
  };
  const client = new Dash.Client(clientOpts);
  
  const submitNoteDocument = async function () {

    await client.isReady();
  
    try {
      // const identity = await client.platform.identities.get('DUxf95cCdPTor7BfWMXmr2VmHQqdKMPQv6fauecy7Wuy');
      const identity = await client.platform.identities.get('FJ85ReAdCiBBRy39JcrYJo8YkoJLa5oSMpziXYoSJ2a7');

      docProperties = {
		  header: '',
		  body: '',
		  identityid: submitText.value + ' ' + new Date().toUTCString(),
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
      console.log("submited login document with message: " + submitText.value)
      client.disconnect();
    }
  };
  submitNoteDocument();
  submitBtn.disabled = false;
  console.log("done")

}, false);








