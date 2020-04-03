const clientOpts = {
  network: 'testnet',
  mnemonic: 'toddler repair print phrase crouch curve charge typical swap bachelor outer upgrade'
};
const client = new Dash.Client(clientOpts);

async function connect() {
  try {
    await client.isReady();
    console.log('connected');
  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    client.disconnect();
  }
}

connect();

// external registered Identity DUxf95cCdPTor7BfWMXmr2VmHQqdKMPQv6fauecy7Wuy

const registerName = async function () {
  try {
    await client.isReady();
    const platform = client.platform;
    const identity = await platform.identities.get('DUxf95cCdPTor7BfWMXmr2VmHQqdKMPQv6fauecy7Wuy');
    const nameRegistration = await platform.names.register('dappuser', identity);
    console.log({nameRegistration});
  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    client.disconnect();
  }
}

registerName();


