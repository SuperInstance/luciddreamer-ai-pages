window.SCENARIO = {
  prompt: 'Tell the night its question…',
  decision: 'What is the tide-dream telling me?',
  factors: [
    { label: 'the tide', weight: 0.90, score: 0.7,  note: 'Rising. Something coming in.' },
    { label: 'the lighthouse', weight: 0.70, score: 0.4,  note: 'Guidance — or warning.' },
    { label: 'the gull', weight: 0.40, score: -0.3, note: 'Noise. Distraction.' },
    { label: 'the drowned phone', weight: 0.60, score: -0.6, note: 'Unreachable. Let it go.' }
  ],
  seedLog: [
    { kind: 'note', text: 'Dream recorded at 4:12 a.m. — salt on the tongue, a bell far off.' },
    { kind: 'note', text: 'Symbols decomposed while the memory is still wet.' }
  ]
};

window.SKIN_CONFIG = {
  domain: 'luciddreamer.ai',
  tagline: 'Catch the dream.',
  forSaleUrl: '#',
  scenario: window.SCENARIO,
  bands: [
    { min: 0.34, label: 'RISE', cls: 'go' },
    { min: -0.34, label: 'DRIFT', cls: 'hold' },
    { min: -Infinity, label: 'RELEASE', cls: 'nogo' }
  ],
  renderExtra: function (root, api) {
    root.innerHTML =
      '<div class="sk-reading">' +
        '<div class="le-label">the reading</div>' +
        '<p data-testid="reading-line"></p>' +
      '</div>';

    var line = root.querySelector('[data-testid="reading-line"]');

    function renderReading() {
      if (!api.factors.length) {
        line.textContent = 'The symbols are still below the surface. Decompose to dream them up.';
        return;
      }
      var best = null, worst = null;
      api.factors.forEach(function (f) {
        var pull = f.weight * f.score;
        if (!best || pull > best.pull) best = { f: f, pull: pull };
        if (!worst || pull < worst.pull) worst = { f: f, pull: pull };
      });
      var v = api.project().band.label;
      line.innerHTML =
        'Tonight leans toward <b>' + v.toLowerCase() + '</b>. ' +
        'Hold <b>' + best.f.label + '</b> close — ' +
        (best.f.note || 'it knows something') + ' ' +
        'And give <b>' + worst.f.label + '</b> no more weight than it deserves.';
    }

    renderReading();
    api.el.addEventListener('input', renderReading);
    var rows = api.el.querySelector('[data-testid="factor-rows"]');
    if (rows) new MutationObserver(renderReading).observe(rows, { childList: true });
  }
};
