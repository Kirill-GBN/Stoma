(function () {
  'use strict';

  function initTabs(root) {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length || !panels.length) return;

    function activate(tab, setFocus) {
      tabs.forEach(function (t, i) {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        t.setAttribute('tabindex', isActive ? '0' : '-1');

        const panel = panels[i];
        if (panel) {
          panel.classList.toggle('is-active', isActive);
          if (isActive) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        }
      });

      if (setFocus) tab.focus();
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab, false);
      });

      tab.addEventListener('keydown', function (e) {
        const currentIndex = tabs.indexOf(tab);
        let nextIndex = null;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            nextIndex = (currentIndex + 1) % tabs.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = tabs.length - 1;
            break;
          default:
            return;
        }

        e.preventDefault();
        activate(tabs[nextIndex], true);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('[data-tabs]');
    containers.forEach(initTabs);
  });
})();
