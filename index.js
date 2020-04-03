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
    mnemonic: 'toddler repair print phrase crouch curve charge typical swap bachelor outer upgrade',
    apps: {
      loginContract: {
        contractId: '7kXTykyrTW192bCTKiMuEX2s15KExZaHKos8GrWCF21D'
      }
    }  
  };
  const client = new Dash.Client(clientOpts);
  
  const submitNoteDocument = async function () {

    const platform = client.platform;
    await client.isReady();
  
    try {
      const identity = await platform.identities.get('DUxf95cCdPTor7BfWMXmr2VmHQqdKMPQv6fauecy7Wuy');

      docProperties = {
        message: submitText.value + ' ' + new Date().toUTCString()
      }
      // Create the note document
      const noteDocument = await platform.documents.create(
        'loginContract.login',
        identity,
        docProperties,
      );
      // Sign and submit the document
      await platform.documents.broadcast(noteDocument, identity);
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








