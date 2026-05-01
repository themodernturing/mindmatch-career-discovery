import json, os, glob

results_dir = 'data' if os.path.basename(os.getcwd()) == 'simulator' else 'simulator/results'
files = glob.glob(os.path.join(results_dir, '*.json'))
data = {}

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        d = json.load(fp)
        persona = d['persona']
        mode = d['mode']
        if persona not in data:
            data[persona] = {}
        data[persona][mode] = d

for p, modes in data.items():
    print(f'=== {p.upper()} ===')
    for m in ['full_signal', 'production']:
        d = modes.get(m)
        if not d: continue
        print(f'  Mode: {m}')
        print(f"  Adaptive: {d['adaptive_scores']}")
        print(f"  O*NET:    {d.get('onet_scores', {})}")
        print(f"  Blended:  {d['blended_scores']}")
        print('  Top 5 Careers:')
        for c in d['top_careers'][:5]:
            pens = ' [' + ', '.join(c['penalties']) + ']' if c['penalties'] else ''
            print(f"    - {c['career']} ({c['score']}%) {pens}")
    print()
