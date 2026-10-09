(function () {
  function requestHeight(frame) {
    frame.contentWindow.postMessage({ type: 'nxevtcd:height-check', token: frame.dataset.nxevtcdDemoToken }, new URL(frame.src, window.location.href).origin);
  }
  // Request again on frame load: Elementor may attach the listener after React's first message.
  document.querySelectorAll('iframe[data-nxevtcd-demo-token]').forEach(function (frame) {
    frame.addEventListener('load', function () { requestHeight(frame); });
    requestHeight(frame);
  });
  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.type !== 'nxevtcd:height') return;
    document.querySelectorAll('iframe[data-nxevtcd-demo-token]').forEach(function (frame) {
      if (event.source !== frame.contentWindow || data.token !== frame.dataset.nxevtcdDemoToken) return;
      if (event.origin !== new URL(frame.src, window.location.href).origin) return;
      var height = Number(data.height);
      if (Number.isFinite(height) && height > 100) frame.style.setProperty('height', Math.ceil(height) + 'px', 'important');
    });
  });
})();