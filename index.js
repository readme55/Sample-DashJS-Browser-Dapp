let submitBtn = document.getElementById('submitBtn');
let submitText = document.getElementById('submitText');
// let submitText = document.getElementById('submitText');
// let submitText = document.getElementById('submitText');
// let submitText = document.getElementById('submitText');

// Mnemonic: toddler repair print phrase crouch curve charge typical swap bachelor outer upgrade
// { user identity: 'DUxf95cCdPTor7BfWMXmr2VmHQqdKMPQv6fauecy7Wuy' }
// name: dappuser
// application identity (for the loginContract):
// { identity: '7kXTykyrTW192bCTKiMuEX2s15KExZaHKos8GrWCF21D' }
// more application identiies if we need for testing:
// { identity: '85Z6qzh9zW58CbjcZ9v3GATUf85R2VF4EL3vFHPejbVv' }
// { identity: '5MwdaAr2AKU417AjiZYFpyMMdmSWAC9chAEdUDvFp1bC' }
// { identity: '4cFRLzYxLLzLP72V7UJNbDxw3aF8y7kT9TAgjqEuHSff' }

submitBtn.addEventListener('click', function () {
  console.log("click")
  submitBtn.disabled = true;

  const clientOpts = {
    network: 'testnet',
    mnemonic: 'grid bind gasp long fox catch inch radar purchase winter woman cactus',
    apps: {
      loginContract: {
        contractId: 'GjUfAtc3FnbFe9HH78GaCSJV7DraAG1ctJeNeujhoqyH'
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
		  plaintext: submitText.value + ' ' + new Date().toUTCString(),
      }
      // Create the note document
      const noteDocument = await client.platform.documents.create(
        'loginContract.message',
        identity,
        docProperties,
      );
      // Sign and submit the document
      await client.platform.documents.broadcast(noteDocument, identity);
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








