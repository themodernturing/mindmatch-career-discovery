import json
import os
import math
import random
from datetime import datetime

# Load data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RESULTS_DIR = os.path.join(BASE_DIR, 'results')

os.makedirs(RESULTS_DIR, exist_ok=True)

with open(os.path.join(DATA_DIR, 'questions.json'), 'r', encoding='utf-8') as f:
    ALL_QUESTIONS = json.load(f)

with open(os.path.join(DATA_DIR, 'onet_questions.json'), 'r', encoding='utf-8') as f:
    ONET_QUESTIONS = json.load(f)

with open(os.path.join(DATA_DIR, 'careers.json'), 'r', encoding='utf-8') as f:
    CAREERS = json.load(f)

# Personas
PERSONAS = {
    'Sara': {
        'desc': 'Accounting student, creative, introverted',
        'biases': {'riasec_artistic': 4.5, 'riasec_conventional': 3.5, 'riasec_realistic': 1.5, 'riasec_social': 2.0, 'riasec_enterprising': 2.0}
    },
    'Ali': {
        'desc': 'CS student, analytical, introverted',
        'biases': {'riasec_investigative': 4.5, 'riasec_realistic': 3.0, 'riasec_artistic': 2.5, 'riasec_social': 1.5, 'riasec_enterprising': 1.5}
    },
    'Hiba': {
        'desc': 'School student, creative/artistic',
        'biases': {'riasec_artistic': 4.8, 'riasec_social': 3.5, 'riasec_investigative': 3.0, 'riasec_realistic': 2.0, 'riasec_enterprising': 2.5}
    },
    'Ahmed': {
        'desc': 'Extroverted, business-oriented',
        'biases': {'riasec_enterprising': 4.5, 'riasec_social': 3.5, 'riasec_investigative': 3.0, 'riasec_artistic': 2.0, 'riasec_conventional': 3.0}
    },
    'Maryam': {
        'desc': 'School commerce/finance',
        'biases': {'riasec_conventional': 4.5, 'riasec_enterprising': 4.0, 'riasec_investigative': 3.5, 'riasec_artistic': 1.5, 'riasec_realistic': 2.0, 'riasec_social': 3.0}
    },
    'Ayesha': {
        'desc': 'University medical/helper',
        'biases': {'riasec_investigative': 4.5, 'riasec_social': 4.5, 'riasec_realistic': 3.5, 'riasec_artistic': 2.0, 'riasec_enterprising': 2.5, 'riasec_conventional': 3.5}
    },
    'Bilal': {
        'desc': 'Confused/mixed/inconsistent',
        'biases': {'riasec_realistic': 3.0, 'riasec_investigative': 3.0, 'riasec_artistic': 3.0, 'riasec_social': 3.0, 'riasec_enterprising': 3.0, 'riasec_conventional': 3.0}
    },
    'Hamza': {
        'desc': 'School science/engineering',
        'biases': {'riasec_investigative': 4.5, 'riasec_realistic': 4.5, 'riasec_conventional': 3.5, 'riasec_social': 1.5, 'riasec_artistic': 2.0, 'riasec_enterprising': 2.0}
    },
    'Daniyal': {
        'desc': 'Introverted creative writer/designer',
        'biases': {'riasec_artistic': 4.8, 'riasec_investigative': 4.0, 'riasec_social': 1.5, 'riasec_enterprising': 2.0, 'riasec_realistic': 1.5, 'riasec_conventional': 2.5}
    },
    'Tariq': {
        'desc': 'Practical hands-on profile (likes tools/building)',
        'biases': {'riasec_realistic': 4.8, 'riasec_investigative': 3.5, 'riasec_conventional': 3.5, 'riasec_social': 1.5, 'riasec_artistic': 1.5, 'riasec_enterprising': 2.0}
    },
    'Fatima': {
        'desc': 'Social helper profile (likes teaching/counselling)',
        'biases': {'riasec_social': 4.8, 'riasec_artistic': 3.5, 'riasec_enterprising': 3.5, 'riasec_investigative': 2.5, 'riasec_realistic': 1.5, 'riasec_conventional': 3.0}
    }
}

def generate_answer(question, persona_biases):
    # Determine base response from biases
    base_val = 3.0
    
    if 'dimensions' in question and question['dimensions']:
        primary_dim = max(question['dimensions'], key=lambda d: abs(d['weight']))['dimension']
        if primary_dim in persona_biases:
            base_val = persona_biases[primary_dim]
            
            primary_weight = max(question['dimensions'], key=lambda d: abs(d['weight']))['weight']
            if primary_weight < 0:
                 base_val = 6 - base_val # flip bias for trade-off / negative weight questions
    
    elif 'dimension' in question: # O*NET
        dim_map = {'R': 'riasec_realistic', 'I': 'riasec_investigative', 'A': 'riasec_artistic', 'S': 'riasec_social', 'E': 'riasec_enterprising', 'C': 'riasec_conventional'}
        full_dim = dim_map.get(question['dimension'])
        if full_dim in persona_biases:
            base_val = persona_biases[full_dim]

    # Add noise
    val = base_val + random.uniform(-0.5, 0.5)
    val = max(1, min(5, round(val)))
    if question.get('reverse_scored'):
        val = 6 - val
    return val

def calculate_trait_uncertainty(responses):
    dim_sums = {}
    dim_weights = {}
    dim_counts = {}
    
    for resp in responses:
        q = resp['question']
        val = resp['value']
        

            
        if q.get('reverse_scored'):
            val = 6 - val
            
        for d in q['dimensions']:
            dim = d['dimension']
            w = d['weight']
            
            if dim not in dim_sums:
                dim_sums[dim] = 0
                dim_weights[dim] = 0
                dim_counts[dim] = 0
                
            dim_sums[dim] += val * w
            dim_weights[dim] += w
            dim_counts[dim] += 1

    results = {}
    TARGET_COVERAGE = 4
    
    for dim in dim_sums:
        if dim_weights[dim] == 0:
            continue
        
        raw_score = (dim_sums[dim] / (dim_weights[dim] * 5)) * 100
        coverage = min(dim_counts[dim] / TARGET_COVERAGE, 1.0)
        consistency = 1.0 # simplified: assuming stable answers for simulator
        stability = 0.5 # simplified: no rank history tracking
        
        confidence = (coverage * 0.5) + (consistency * 0.3) + (stability * 0.2)
        
        results[dim] = {
            'score': max(0, min(100, raw_score)),
            'confidence': confidence,
            'count': dim_counts[dim]
        }
    return results

def get_profile(trait_scores):
    profile = {}
    riasec = ['riasec_realistic', 'riasec_investigative', 'riasec_artistic', 'riasec_social', 'riasec_enterprising', 'riasec_conventional']
    for r in riasec:
        if r in trait_scores:
            profile[r] = trait_scores[r]['score']
        else:
            profile[r] = 25 # Default 25 (not 50) as per production
            
    return profile

def score_onet(responses):
    sums = {'R':0, 'I':0, 'A':0, 'S':0, 'E':0, 'C':0}
    for r in responses:
        dim = r['question']['dimension']
        sums[dim] += r['value']
        
    scores = {}
    map_to_full = {'R': 'riasec_realistic', 'I': 'riasec_investigative', 'A': 'riasec_artistic', 'S': 'riasec_social', 'E': 'riasec_enterprising', 'C': 'riasec_conventional'}
    for d, s in sums.items():
        score = round(((s - 10) / 40) * 100)
        scores[map_to_full[d]] = max(0, min(100, score))
    return scores

def match_careers(adaptive_profile, onet_profile, trait_scores):
    matches = []
    
    riasec_keys = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
    
    for career in CAREERS:
        weighted_match_sum = 0
        total_weight = 0
        penalty_multiplier = 1.0
        
        penalties = []
        
        for short_k in riasec_keys:
            full_k = 'riasec_' + short_k
            c_score = career['riasec_profile'].get(short_k, 0)
            
            a_score = adaptive_profile.get(full_k, 25)
            o_score = onet_profile.get(full_k)
            
            if o_score is not None:
                user_score = 0.6 * a_score + 0.4 * o_score
            else:
                user_score = a_score
                
            conf = trait_scores.get(full_k, {}).get('confidence', 0.5) if o_score is None else 0.8
            
            diff = abs(user_score - c_score)
            similarity = max(0, 100 - (diff * diff) / 12)
            
            deficit = c_score - user_score
            if deficit > 20:
                importance = c_score / 100  # low-requirement dims penalise less
                penalty = min(0.5, deficit * 0.01) * importance
                penalty_multiplier *= (1 - penalty)
                penalties.append(f"{short_k} deficit (-{penalty*100:.0f}%)")
                
            if user_score < 30 and c_score > 75:
                penalty_multiplier *= 0.5
                penalties.append(f"{short_k} hard mismatch (-50%)")
                
            surplus = user_score - c_score
            if user_score > 75 and c_score < 35 and surplus > 40:
                penalty_multiplier *= 0.85
                penalties.append(f"{short_k} unmet talent (-15%)")
                
            req_weight = max(0.3, c_score / 100)
            weighted_match_sum += similarity * conf * req_weight
            total_weight += conf * req_weight
            
        if total_weight > 0:

            final_match = (weighted_match_sum / total_weight) * penalty_multiplier
            final_match = ((final_match / 100) ** 1.1) * 100 # Stretch decompression
        else:
            final_match = 0
            
        matches.append({
            'career': career['name'],
            'category': career.get('category'),
            'raw_score': final_match,
            'score': round(final_match, 1),
            'penalties': penalties
        })
        
    matches.sort(key=lambda x: x['raw_score'], reverse=True)
    
    category_counts = {}
    for match in matches[:15]:
        category = match.get('category')
        category_counts[category] = category_counts.get(category, 0) + 1
        
    final_matches = []
    for match in matches:
        score = match['raw_score']
        density = category_counts.get(match.get('category'), 0)
        
        if density >= 3:
            score *= 1 + min(density, 5) * 0.01
            
        final_matches.append({
            **match,
            'score': round(min(100, score), 1)
        })
    
    final_matches.sort(key=lambda x: (x['score'], x['raw_score']), reverse=True)
    return final_matches[:20]

def simulate_adaptive_flow(persona_biases):
    # Simulated adaptive flow: 
    # Force ~4 core questions per RIASEC dimension, plus a few branch/clarifiers
    # Assumes production stops around ~28 questions when RIASEC coverage is met.
    responses = []
    asked = set()
    
    for dim in ['riasec_realistic', 'riasec_investigative', 'riasec_artistic', 'riasec_social', 'riasec_enterprising', 'riasec_conventional']:
        dim_qs = [q for q in ALL_QUESTIONS if q['category'] == 'core' and any(d['dimension'] == dim for d in q['dimensions'])]
        
        selected = 0
        for q in dim_qs:
            if q['id'] not in asked and selected < 4:
                val = generate_answer(q, persona_biases)
                responses.append({'question': q, 'value': val})
                asked.add(q['id'])
                selected += 1
                
    extra_qs = [q for q in ALL_QUESTIONS if q['category'] in ['branch', 'clarifier'] and q['id'] not in asked]
    random.shuffle(extra_qs)
    for q in extra_qs[:4]:
        val = generate_answer(q, persona_biases)
        responses.append({'question': q, 'value': val})
        asked.add(q['id'])
        
    return responses

def run_simulation(persona_name, persona_data, mode):
    biases = persona_data['biases']
    
    if mode == 'full_signal':
        ad_responses = [{'question': q, 'value': generate_answer(q, biases)} for q in ALL_QUESTIONS]
    else:
        ad_responses = simulate_adaptive_flow(biases)
        
    onet_responses = [{'question': q, 'value': generate_answer(q, biases)} for q in ONET_QUESTIONS]
    
    trait_scores = calculate_trait_uncertainty(ad_responses)
    adaptive_profile = get_profile(trait_scores)
    onet_profile = score_onet(onet_responses)
    
    blended_profile = {}
    riasec_keys = ['riasec_realistic', 'riasec_investigative', 'riasec_artistic', 'riasec_social', 'riasec_enterprising', 'riasec_conventional']
    for k in riasec_keys:
        a = adaptive_profile.get(k, 25)
        o = onet_profile.get(k, 0)
        blended_profile[k] = round(0.6 * a + 0.4 * o, 1)
        
    matches = match_careers(adaptive_profile, onet_profile, trait_scores)
    
    result = {
        'persona': persona_name,
        'mode': mode,
        'timestamp': datetime.now().isoformat(),
        'answers_count': {
            'adaptive': len(ad_responses),
            'onet': len(onet_responses)
        },
        'adaptive_scores': {k: round(v, 1) for k,v in adaptive_profile.items()},
        'onet_scores': onet_profile,
        'blended_scores': blended_profile,
        'top_careers': matches,
        'diagnostics': {
            'note': 'AI clarifiers skipped. Consistency=1.0, Stability=0.5 assumed.'
        }
    }
    
    filename = f"{persona_name.lower()}_{mode}.json"
    with open(os.path.join(RESULTS_DIR, filename), 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
        
    print(f"\n{'='*50}")
    print(f" PERSONA: {persona_name} ({mode.upper()})")
    print(f"{'='*50}")
    print(f"\n-- Adaptive RIASEC Scores ({len(ad_responses)} qs) --")
    print(" ".join(f"{k.split('_')[1][0].upper()}: {v:.1f}" for k,v in adaptive_profile.items() if k in riasec_keys))
    
    print(f"\n-- O*NET RIASEC Scores ({len(onet_responses)} qs) --")
    print(" ".join(f"{k.split('_')[1][0].upper()}: {v}" for k,v in onet_profile.items()))
    
    print(f"\n-- Final Blended Scores --")
    print(" ".join(f"{k.split('_')[1][0].upper()}: {v}" for k,v in blended_profile.items()))
    
    print(f"\n-- Top 10 Careers --")
    for i, m in enumerate(matches[:10]):
        pen_str = f" [{', '.join(m['penalties'])}]" if m['penalties'] else ""
        print(f"  {i+1}. {m['career']} - {m['score']}%{pen_str}")

if __name__ == '__main__':
    random.seed(42) # For reproducibility
    for name, data in PERSONAS.items():
        run_simulation(name, data, 'full_signal')
        run_simulation(name, data, 'production')
