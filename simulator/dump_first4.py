import json, os

results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'results')

for name in ['Sara','Ali','Hiba','Ahmed']:
    f = os.path.join(results_dir, name.lower() + '_production.json')
    d = json.load(open(f, 'r', encoding='utf-8'))
    mode = d['mode'].upper()
    print('=== {} ({}) - {} adaptive + {} onet ==='.format(name, mode, d['answers_count']['adaptive'], d['answers_count']['onet']))
    print('  Adaptive: {}'.format(d['adaptive_scores']))
    print('  O*NET:    {}'.format(d['onet_scores']))
    print('  Blended:  {}'.format(d['blended_scores']))
    print('  Top 10 Careers:')
    for i, c in enumerate(d['top_careers'][:10]):
        pen_list = c.get('penalties', [])
        pen = '  [{}]'.format(', '.join(pen_list)) if pen_list else ''
        print('    {}. {} ({}%){}'.format(i+1, c['career'], c['score'], pen))
    print()
