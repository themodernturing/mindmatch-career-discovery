# CareerLens Testing Simulator

A local Python testing harness that mirrors the production CareerLens assessment pipeline, enabling rapid sub-second test iterations.

## Why this exists

Testing the adaptive assessment in the browser takes ~1 hour per test. When tweaking weights, penalties, or O*NET logic, waiting an hour for feedback is impossible. This simulator faithfully replicates the production logic so you can validate scoring refinements instantly.

## How it works

1. **Data Export**: Reads raw data from `lib/questions.ts` and `lib/careers.ts` using `export_data.js`.
2. **Simulation**: The `simulate_careerlens.py` script applies persona biases to answer questions, runs them through the exact production formulas, and ranks careers.
3. **Modes**: 
   - `FULL_SIGNAL`: Answers all 90 questions. Good for isolating scoring logic.
   - `PRODUCTION`: Simulates the ~24 question adaptive flow. Good for testing actual user experience.

## Usage

### 1. Re-export data (if you change TS files)
```bash
node export_data.js
```

### 2. Run the simulator
```bash
python simulate_careerlens.py
```

### 3. View Results
Results will be printed to the console and saved as JSON files in the `results/` directory for diffing.

## Personas

Defined in `simulate_careerlens.py`. To add a new persona, add an entry to the `PERSONAS` dictionary with their RIASEC biases.
