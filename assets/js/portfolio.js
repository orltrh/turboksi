/* ============================================================
   portfolio.js — loaded only by portfolio.html
   ============================================================ */

(function initPortfolio() {
  var grid    = document.getElementById('portfolio-grid');
  var filters = document.querySelectorAll('.filter-btn');
  var allData = [];

  if (!grid) return;

  /* Embedded fallback — used when fetch fails (e.g. file:// protocol) */
  var FALLBACK_DATA = [
    {
      id: 1,
      title: 'Centrifugal Pump Recurring Failure Investigation',
      sector: 'RCFA',
      type: 'RCFA + Report',
      year: 2023,
      location: 'East Kalimantan, Indonesia',
      image: 'assets/img/projects/projects.jpg',
      thumbGradient: 'linear-gradient(135deg, #0B2545, #1B4F8A)',
      description: 'Root cause investigation of recurring pump failures at an oil and gas facility. Identified bearing wear patterns and lubrication deficiencies. Delivered corrective and preventive action plan.',
      challenge: 'The facility experienced repeated bearing failures on a critical centrifugal pump, resulting in three unplanned shutdowns within six months, causing significant production losses and increasing maintenance costs.',
      approach: 'Applied systematic RCFA methodology including equipment teardown inspection, lubrication oil analysis, vibration data review, and Why Tree analysis to identify all contributing causes. Interviewed operations and maintenance personnel to establish the failure timeline.',
      outcome: 'Root cause identified as improper bearing installation combined with incorrect lubricant selection for the operating temperature range. Issued a corrective action plan covering installation procedure revision, lubricant specification update, and quarterly monitoring schedule. No recurrence reported in the 12-month follow-up period.'
    },
    {
      id: 2,
      title: 'Unplanned Shutdown RCA: Steam Turbine Trip',
      sector: 'RCFA',
      type: 'RCA + Consultancy',
      year: 2023,
      location: 'Central Java, Indonesia',
      image: 'assets/img/projects/projects.jpg',
      thumbGradient: 'linear-gradient(135deg, #1B4F8A, #2874C8)',
      description: 'Systematic investigation of a critical steam turbine trip using Why Tree methodology. Findings presented to plant management with structured actionable recommendations.',
      challenge: 'A 50 MW steam turbine at a power generation facility experienced an unplanned trip during peak load, resulting in significant generation loss and grid stability concerns. The root cause was initially unclear, with multiple suspected contributing systems.',
      approach: 'Conducted a structured investigation using Why Tree analysis across six cause categories: machine, method, material, measurement, environment, and human factors. Reviewed DCS trip records, vibration trends, steam quality data, and maintenance history. Facilitated root cause confirmation workshop with plant engineering team.',
      outcome: 'Root cause identified as a combination of moisture carryover in the steam supply and a degraded axial thrust bearing. Recommendations included steam separator maintenance schedule revision, bearing inspection interval tightening, and alarm threshold optimization. Management accepted all recommendations and budgeted for implementation in the next planned outage.'
    },
    {
      id: 3,
      title: 'In-House RCA Training Program',
      sector: 'Training',
      type: 'Training',
      year: 2024,
      location: 'Cikarang, West Java, Indonesia',
      image: 'assets/img/projects/projects.jpg',
      thumbGradient: 'linear-gradient(135deg, #0f3460, #16213e)',
      description: '2-day intensive training for 20+ engineering and maintenance personnel. Covered RCA methodology, Why Tree analysis, and documentation best practices with live case studies.',
      challenge: 'The client\'s maintenance team was responding reactively to recurring equipment failures with no structured investigation process. Repeat failures were common, and there was no standardized way to document findings or share lessons learned across shifts.',
      approach: 'Designed and delivered a 2-day in-house training program customized for the client\'s manufacturing environment. Sessions covered RCA theory, Why Tree analysis, evidence collection techniques, and corrective action planning. Participants worked through three live case studies drawn from the client\'s own failure history.',
      outcome: '23 maintenance and engineering personnel completed the program. The client adopted RCA Tool as their standard investigation platform immediately following the training. Within the first three months, the team completed five documented investigations independently with no external facilitation required.'
    },
    {
      id: 4,
      title: 'Vibration Monitoring Program — Geothermal Plant',
      sector: 'Condition Monitoring',
      type: 'Consultancy + Implementation',
      year: 2024,
      location: 'West Java, Indonesia',
      image: 'assets/img/projects/projects.jpg',
      thumbGradient: 'linear-gradient(135deg, #0B2545, #2874C8)',
      description: 'Designed and implemented a structured vibration monitoring program for critical rotating assets at a geothermal power plant, reducing unplanned downtime through predictive maintenance.',
      challenge: 'The plant lacked a formal condition monitoring program, relying entirely on reactive maintenance. Several critical machines — including high-pressure pumps and steam separators — had no baseline vibration data, making fault detection difficult.',
      approach: 'Conducted initial vibration surveys to establish baseline data on all critical assets. Defined measurement routes, alarm limits, and trending intervals based on equipment criticality. Trained the plant maintenance team on data collection and basic spectral analysis.',
      outcome: 'Program covered 34 rotating assets across three process trains. Within six months, two impending bearing faults were detected early and addressed during planned windows, preventing unplanned outages estimated at 12+ hours each.'
    },
    {
      id: 5,
      title: 'PLC Control System Upgrade — Conveyor Line',
      sector: 'PLC & Automation',
      type: 'Engineering + Commissioning',
      year: 2024,
      location: 'Banten, Indonesia',
      image: 'assets/img/projects/projects.jpg',
      thumbGradient: 'linear-gradient(135deg, #16213e, #0f3460)',
      description: 'Full PLC logic redesign and commissioning for a conveyor and sorting line at a packaging facility, replacing an obsolete controller and improving throughput reliability.',
      challenge: 'The existing PLC system was a discontinued platform with no available spare parts or support. Frequent nuisance faults and undocumented ladder logic made troubleshooting time-consuming and risky, impacting production availability.',
      approach: 'Reverse-engineered the existing ladder logic through field observation and I/O mapping. Migrated to a Siemens S7-1200 platform with structured block programming. Developed HMI screens for operator visibility and integrated interlocks with the upstream packaging line.',
      outcome: 'System commissioned without production interruption over a planned weekend window. Fault frequency reduced by over 70% in the three months following commissioning. Full documentation package delivered to the client\'s engineering team.'
    }
  ];

  /* Escape HTML to safely embed strings as attribute values */
  function escAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderCards(data) {
    if (!data.length) {
      grid.innerHTML = '<p class="no-results">No projects found for this filter.</p>';
      return;
    }

    grid.innerHTML = data.map(function (item) {
      var thumbStyle = 'background:' + (item.thumbGradient || 'var(--clr-navy)');
      var imgTag = item.image
        ? '<img src="' + escAttr(item.image) + '" alt="' + escAttr(item.title) + '" onerror="this.remove()">'
        : '';

      return [
        '<article class="portfolio-card anim-up in-view"',
        '  data-project-id="' + escAttr(item.id) + '"',
        '  data-title="' + escAttr(item.title) + '"',
        '  data-sector="' + escAttr(item.sector) + '"',
        '  data-type="' + escAttr(item.type) + '"',
        '  data-year="' + escAttr(item.year) + '"',
        '  data-location="' + escAttr(item.location || '') + '"',
        '  data-image="' + escAttr(item.image || '') + '"',
        '  data-thumb-gradient="' + escAttr(item.thumbGradient || '') + '"',
        '  data-description="' + escAttr(item.description || '') + '"',
        '  data-challenge="' + escAttr(item.challenge || '') + '"',
        '  data-approach="' + escAttr(item.approach || '') + '"',
        '  data-outcome="' + escAttr(item.outcome || '') + '">',
        '  <div class="portfolio-thumb" style="' + thumbStyle + '" aria-hidden="true">',
        '    ' + imgTag,
        '  </div>',
        '  <div class="portfolio-body">',
        '    <div>',
        '      <div class="portfolio-sector">' + escAttr(item.sector) + '</div>',
        '      <h4>' + escAttr(item.title) + '</h4>',
        '      <p>' + escAttr(item.description) + '</p>',
        '    </div>',
        '    <div class="portfolio-meta">',
        '      <span class="meta-year">📅 ' + escAttr(item.year) + '</span>',
        '      <span class="meta-type">' + escAttr(item.type) + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('\n');
    }).join('\n');
  }

  function setActive(btn) {
    filters.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActive(btn);
      var sector = btn.dataset.filter;
      renderCards(sector === 'All' ? allData : allData.filter(function (item) {
        return item.sector === sector;
      }));
    });
  });

  function init(data) {
    allData = data;
    renderCards(allData);
  }

  /* Try fetch first; fall back to embedded data if unavailable */
  if (window.location.protocol === 'file:') {
    init(FALLBACK_DATA);
    return;
  }

  fetch('data/portfolio.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) { init(data); })
    .catch(function (err) {
      console.warn('Portfolio fetch failed, using embedded data:', err);
      init(FALLBACK_DATA);
    });
})();
