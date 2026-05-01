import json, os

results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'results')

for name in ['Ayesha','Bilal','Sara','Ali']:
    f = os.path.join(results_dir, name.lower() + '_production.json')
    d = json.load(open(f, 'r', encoding='utf-8'))
    print('=== {} (PRODUCTION) ==='.format(name))
    r = d['blended_scores']
    print('  Blended: R={} I={} A={} S={} E={} C={}'.format(
        r.get('riasec_realistic','-'), r.get('riasec_investigative','-'),
        r.get('riasec_artistic','-'), r.get('riasec_social','-'),
        r.get('riasec_enterprising','-'), r.get('riasec_conventional','-')))
    print('  Top 10 Careers:')
    for i, c in enumerate(d['top_careers'][:10]):
        pen_list = c.get('penalties', [])
        pen = '  [{}]'.format(', '.join(pen_list)) if pen_list else ''
        print('    {}. {} ({}%){}'.format(i+1, c['career'], c['score'], pen))
    print()
