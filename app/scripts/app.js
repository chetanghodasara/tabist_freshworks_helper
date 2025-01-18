window.frsh_init().then(function(client) {
  window.client = client;
});

async function showModal() {
  try {
    const data = await client.interface.trigger('showModal', {
      title: 'Tabist Freshworks Helper',
      template: './views/modal.html'
    });
    console.log('Parent:InterfaceAPI:showModal', data);
  } catch (error) {
    console.log('Parent:InterfaceAPI:showModal', error);
  }
}

async function showDialog() {
  try {
    const data = await client.interface.trigger('showDialog', {
      title: 'Sample Dialog',
      template: './views/modal.html'
    });
    console.log('Parent:InterfaceAPI:showDialog', data);
  } catch (error) {
    console.log('Parent:InterfaceAPI:showDialog', error);
  }
}
