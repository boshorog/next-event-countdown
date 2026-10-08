(function () {
  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.type !== 'nxevtcd:height') return;
    document.querySelectorAll('iframe[data-nxevtcd-demo-token]').forEach(function (frame) {
      if (event.source !== frame.contentWindow || data.token !== frame.dataset.nxevtcdDemoToken) return;
      if (event.origin !== new URL(frame.src, window.location.href).origin) return;
      var height = Number(data.height);
      if (Number.isFinite(height) && height > 100) frame.style.height = Math.ceil(height) + 'px';
    });
  });
})();