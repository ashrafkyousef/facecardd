(() => {
  let promptEvent;
  const button=document.getElementById('install-app');
  const help=document.getElementById('install-help');
  const installed=()=>window.matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
  if(installed())button.hidden=true;
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;});
  window.addEventListener('appinstalled',()=>{promptEvent=null;button.hidden=true;});
  button.addEventListener('click',async()=>{
    document.querySelector('.menu').open=false;
    if(promptEvent){const prompt=promptEvent;promptEvent=null;await prompt.prompt();await prompt.userChoice;}
    else help.showModal();
  });
  if('serviceWorker' in navigator){
    window.addEventListener('load',async()=>{
      try{
        const registration=await navigator.serviceWorker.register(new URL('sw.js',location.href),{scope:'./',updateViaCache:'none'});
        const worker=registration.installing || registration.waiting || registration.active;
        if(worker && worker.state!=='activated')await new Promise((resolve,reject)=>{
          worker.addEventListener('statechange',()=>{if(worker.state==='activated')resolve();if(worker.state==='redundant')reject(new Error('Offline setup failed'));});
        });
        document.getElementById('install-status').textContent='Your card is ready for offline use on this device.';
        registration.update().catch(()=>{});
      }catch(error){console.warn('Offline setup unavailable',error);}
    });
  }
})();
