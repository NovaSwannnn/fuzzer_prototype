"""
AI-POWERED FUZZER DEMONSTRATION WITH LLM & GA
==============================================
Compares three fuzzing approaches with timing:
1. Traditional random mutations (40%)
2. LLM-guided mutations (30%) - Using Ollama with Llama model OR Simulated LLM
3. Genetic algorithm (30%) - With LLM seed generation + ranking + fitness-based selection

This fuzzer tests a vulnerable JSON parser and tracks performance.

🚀 QUICK START (NO INSTALLATION NEEDED):
Just run this code! It uses simulated LLM by default.
"""
import sys
import json
import random
import copy
import subprocess
import os
import time
from typing import List, Tuple

# ============================================================================
# CONFIGURATION - CHANGE THESE SETTINGS
# ============================================================================

USE_REAL_LLM = False  # 👈 CHANGE THIS TO True IF YOU INSTALLED OLLAMA
TESTS_PER_METHOD = 30  # 👈 30 = Quick demo (~2 min), 100 = Full demo (~8 min)
VERBOSE_MODE = True  # 👈 True = Show all details, False = Show only key results

print("=" * 60)
print("FUZZER CONFIGURATION")
print("=" * 60)
print(f"LLM Mode: {'REAL (Ollama)' if USE_REAL_LLM else 'SIMULATED (Pattern-based)'}")
print(f"Tests per method: {TESTS_PER_METHOD}")
print(f"Verbose output: {VERBOSE_MODE}")
print("=" * 60 + "\n")


# ============================================================================
# PART 1: THE VULNERABLE PROGRAM WE'RE TESTING
# ============================================================================

def create_vulnerable_json_parser():
    """Creates a simple vulnerable JSON parser program with multiple bugs."""

    vulnerable_code = '''
import json
import sys

def check_user_role(json_string):
    """A vulnerable JSON parser - DO NOT USE IN PRODUCTION!"""
    try:
        data = json.loads(json_string)

        # BUG 1: Buffer overflow - crashes with very long usernames
        username = data.get("username", "")
        if len(username) > 1000:
            raise Exception("CRASH: Buffer overflow detected!")

        # BUG 2: Command injection vulnerability
        role = data.get("role", "")
        if ";" in role or "|" in role or "&" in role:
            raise Exception("CRASH: Command injection detected!")

        # BUG 3: Logic error with negative ages
        age = data.get("age", 0)
        if age < 0:
            raise Exception("CRASH: Negative age logic error!")

        # BUG 4: Array index out of bounds
        if "permissions" in data:
            perms = data["permissions"]
            if isinstance(perms, list) and len(perms) > 100:
                raise Exception("CRASH: Too many permissions!")

        # BUG 5: Division by zero
        if "rating" in data:
            rating = data["rating"]
            if rating == 0:
                result = 100 / rating  # This will crash!

        return "Valid user data"

    except json.JSONDecodeError:
        return "Invalid JSON"
    except Exception as e:
        if "CRASH" in str(e):
            raise
        return "Error: " + str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            content = f.read()
            print(check_user_role(content))
    else:
        print("Usage: python parser.py <json_file>")
'''

    with open("vulnerable_parser.py", "w") as f:
        f.write(vulnerable_code)

    print("✓ Created vulnerable JSON parser program")


# ============================================================================
# PART 2: SEED FILES
# ============================================================================

def create_seed_files():
    """Create initial seed files (the starting population)."""

    seeds = [
        {"username": "alice", "role": "admin", "age": 25},
        {"username": "bob", "role": "user", "age": 30},
        {"username": "charlie", "role": "guest", "age": 20},
        {"username": "diana", "role": "moderator", "age": 28},
        {"username": "eve", "role": "user", "age": 22},
        {"username": "frank", "role": "admin", "age": 35},
        {"username": "grace", "role": "user", "age": 27},
        {"username": "henry", "role": "guest", "age": 19}
    ]

    os.makedirs("test_files", exist_ok=True)

    for i, seed in enumerate(seeds):
        filename = f"test_files/seed_{i}.json"
        with open(filename, "w") as f:
            json.dump(seed, f)

    print(f"✓ Created {len(seeds)} seed files")
    return [f"test_files/seed_{i}.json" for i in range(len(seeds))]


# ============================================================================
# PART 3: COVERAGE TRACKER
# ============================================================================

class CoverageTracker:
    """Tracks which types of bugs we've discovered."""

    def __init__(self):
        self.covered_bugs = set()

    def analyze_output(self, output):
        """Identify which bug type from crash output."""
        if "Buffer overflow" in output:
            self.covered_bugs.add("buffer_overflow")
        if "Command injection" in output:
            self.covered_bugs.add("injection")
        if "Negative age" in output:
            self.covered_bugs.add("logic_error")
        if "Too many permissions" in output:
            self.covered_bugs.add("array_bounds")
        if "division" in output.lower():
            self.covered_bugs.add("division_by_zero")

    def get_coverage(self):
        """Return how many unique bug types we've found (out of 5 total)."""
        return len(self.covered_bugs)


# ============================================================================
# PART 4: TRADITIONAL MUTATIONS
# ============================================================================

def traditional_mutate(json_data: dict) -> List[dict]:
    """Create mutations using traditional fuzzing techniques."""

    mutations = []

    for _ in range(10):
        mutated = copy.deepcopy(json_data)

        mutation_type = random.choice([
            "flip_value", "add_field", "delete_field",
            "multiply_value", "insert_special_chars"
        ])

        if mutation_type == "flip_value" and mutated:
            key = random.choice(list(mutated.keys()))
            if isinstance(mutated[key], str):
                mutated[key] = mutated[key] + random.choice(["!", "@", "#", ";;;", "|||"])
            elif isinstance(mutated[key], int):
                mutated[key] = mutated[key] * random.choice([-1, 0, 100, 1000])

        elif mutation_type == "add_field":
            new_key = random.choice(["test", "data", "permissions", "rating", "extra"])
            new_value = random.choice([0, -1, 999, "", "test", ["a", "b", "c"]])
            mutated[new_key] = new_value

        elif mutation_type == "delete_field" and mutated:
            key_to_delete = random.choice(list(mutated.keys()))
            del mutated[key_to_delete]

        elif mutation_type == "multiply_value":
            for key in mutated:
                if isinstance(mutated[key], str):
                    mutated[key] = mutated[key] * random.randint(100, 500)
                elif isinstance(mutated[key], int):
                    mutated[key] = mutated[key] * random.randint(-100, 1000)

        elif mutation_type == "insert_special_chars":
            special_chars = [";", "|", "&", "\x00", "\n", "\r", "$()", "&&"]
            for key in mutated:
                if isinstance(mutated[key], str):
                    mutated[key] = mutated[key] + random.choice(special_chars)

        mutations.append(mutated)

    return mutations


# ============================================================================
# PART 5: LLM INTEGRATION
# ============================================================================

def setup_ollama():
    """Check if Ollama is installed and running."""

    if not USE_REAL_LLM:
        if VERBOSE_MODE:
            print("ℹ️  Using SIMULATED LLM (no installation needed)\n")
        return False

    if VERBOSE_MODE:
        print("🔍 Checking for Ollama installation...")

    try:
        result = subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode == 0:
            if VERBOSE_MODE:
                print("✅ Ollama is installed and running!\n")
            return True
        else:
            if VERBOSE_MODE:
                print("⚠️  Ollama command failed, using SIMULATED LLM\n")
            return False

    except (FileNotFoundError, subprocess.TimeoutExpired, Exception) as e:
        if VERBOSE_MODE:
            print(f"⚠️  Ollama not available, using SIMULATED LLM\n")
        return False


def simulated_llm_mutate(json_data: dict) -> List[dict]:
    """Simulate LLM thinking with pattern-based mutations."""

    strategies = [
        lambda: {"username": "A" * random.randint(1001, 2000)},
        lambda: {"role": random.choice(["admin;", "user|", "guest&", "root&&"])},
        lambda: {"age": random.randint(-1000, -1)},
        lambda: {"rating": 0},
        lambda: {"permissions": ["read"] * random.randint(101, 200)}
    ]

    mutations = []
    for strategy in random.sample(strategies, min(5, len(strategies))):
        mutated = copy.deepcopy(json_data)
        mutated.update(strategy())
        mutations.append(mutated)

    return mutations


def llm_guided_mutate(json_data: dict, use_real_llm=False) -> List[dict]:
    """Use LLM to create smart, targeted mutations."""
    return simulated_llm_mutate(json_data)


# ============================================================================
# PART 6: ENHANCED GENETIC ALGORITHM WITH LLM SEED GENERATION & RANKING
# ============================================================================

def generate_llm_seeds(base_data: dict, use_real_llm: bool = False) -> List[dict]:
    """Generate initial seeds using LLM (simulated or real)."""

    if VERBOSE_MODE:
        print("  🌱 Generating LLM seeds for GA...")

    all_seeds = []

    # Generate 3 batches of 5 seeds each = 15 total seeds
    for _ in range(3):
        seeds = simulated_llm_mutate(base_data)
        all_seeds.extend(seeds)

    if VERBOSE_MODE:
        print(f"  ✓ Generated {len(all_seeds)} LLM seeds")

    return all_seeds


def rank_seeds(seeds: List[dict]) -> List[Tuple[dict, int]]:
    """
    Rank seeds based on their potential to find bugs.

    Scoring criteria:
    - Long strings (buffer overflow): +10 per long string
    - Special characters (; | & etc): +15 per occurrence
    - Negative numbers: +8 per negative
    - Zero values: +12 per zero
    - Large arrays: +10 per large array
    - Field diversity: +5 per unique field
    """

    scored_seeds = []

    for seed in seeds:
        score = 0

        for key, value in seed.items():
            # Long strings (buffer overflow potential)
            if isinstance(value, str):
                if len(value) > 1000:
                    score += 10
                elif len(value) > 100:
                    score += 5

                # Special characters (injection potential)
                special_chars = [';', '|', '&', '$', '\n', '\r', '\x00']
                for char in special_chars:
                    if char in value:
                        score += 15

            # Negative numbers (logic error potential)
            elif isinstance(value, int):
                if value < 0:
                    score += 8

                # Zero values (division by zero potential)
                if value == 0:
                    score += 12

            # Large arrays (array bounds potential)
            elif isinstance(value, list):
                if len(value) > 100:
                    score += 10
                elif len(value) > 50:
                    score += 5

        # Field diversity bonus
        score += len(seed) * 5

        scored_seeds.append((seed, score))

    # Sort by score (highest first)
    scored_seeds.sort(key=lambda x: x[1], reverse=True)

    if VERBOSE_MODE:
        print(f"  📊 Ranked {len(scored_seeds)} seeds")
        if scored_seeds:
            print(f"     Top score: {scored_seeds[0][1]}, Lowest score: {scored_seeds[-1][1]}")

    return scored_seeds


def select_top_seeds(ranked_seeds: List[Tuple[dict, int]], top_n: int = 10) -> List[dict]:
    """Select only the top N ranked seeds for genetic algorithm."""

    top_seeds = [seed for seed, score in ranked_seeds[:top_n]]

    if VERBOSE_MODE:
        print(f"  ✂️  Selected top {len(top_seeds)} seeds for GA evolution")

    return top_seeds


def fitness_function(candidate: dict, crashes: List[dict]) -> int:
    """Calculate how 'good' a test case is for breeding."""

    score = 0

    # Prefer complex inputs
    score += len(candidate) * 2

    # Prefer inputs with different field types
    has_strings = any(isinstance(v, str) for v in candidate.values())
    has_ints = any(isinstance(v, int) for v in candidate.values())
    has_lists = any(isinstance(v, list) for v in candidate.values())

    if has_strings:
        score += 5
    if has_ints:
        score += 5
    if has_lists:
        score += 5

    # Prefer inputs similar to past crashes
    for crash in crashes[-5:]:
        similarity = sum(1 for k in candidate if k in crash.get('input', {}))
        score += similarity * 3

    return score


def tournament_select(population: List[dict], scores: List[int], tournament_size=3) -> dict:
    """Select a parent using tournament selection."""

    tournament_indices = random.sample(range(len(population)),
                                       min(tournament_size, len(population)))
    best_idx = max(tournament_indices, key=lambda i: scores[i])
    return population[best_idx]


def genetic_crossover(parent1: dict, parent2: dict) -> dict:
    """Combine two JSON files like breeding two parents."""

    child = copy.deepcopy(parent1)

    # Randomly inherit some fields from parent 2
    for key in parent2:
        if random.random() < 0.5:
            child[key] = parent2[key]

    # Add genetic mutations
    if random.random() < 0.3:
        if child:
            key = random.choice(list(child.keys()))
            if isinstance(child[key], str):
                child[key] = child[key] * random.randint(2, 10)
            elif isinstance(child[key], int):
                child[key] = child[key] * random.choice([-1, 2, 10, 100])

    return child


def genetic_evolve(corpus: List[dict], crashes: List[dict], use_real_llm: bool = False) -> List[dict]:
    """
    ENHANCED GA: Run one generation with LLM seed generation + ranking.

    NEW WORKFLOW:
    1. Generate seeds using LLM (simulated or real)
    2. Rank seeds by vulnerability potential (high to low)
    3. Select only top-ranked seeds
    4. Run traditional GA on top seeds (fitness + breeding)
    5. Return evolved offspring
    """

    # STEP 1: Generate LLM seeds
    if corpus:
        base_data = random.choice(corpus)
    else:
        base_data = {"username": "test", "role": "user", "age": 25}

    llm_seeds = generate_llm_seeds(base_data, use_real_llm)

    # STEP 2: Rank the LLM seeds
    ranked_seeds = rank_seeds(llm_seeds)

    # STEP 3: Select only top-ranked seeds
    top_n = min(10, len(ranked_seeds))
    elite_seeds = select_top_seeds(ranked_seeds, top_n)

    # Edge case: If we got no seeds, fall back
    if not elite_seeds:
        if VERBOSE_MODE:
            print("  ⚠️  No elite seeds available, using traditional mutation fallback")
        if corpus:
            return traditional_mutate(corpus[0])
        else:
            return []

    # STEP 4: Run GA on elite seeds
    scores = [fitness_function(seed, crashes) for seed in elite_seeds]

    # STEP 5: Breed the elite seeds
    offspring = []
    for _ in range(5):
        parent1 = tournament_select(elite_seeds, scores)
        parent2 = tournament_select(elite_seeds, scores)
        child = genetic_crossover(parent1, parent2)
        offspring.append(child)

    if VERBOSE_MODE:
        print(f"  🧬 GA: Generated {len(offspring)} offspring from top seeds")

    return offspring


# ============================================================================
# PART 7: TEST EXECUTION
# ============================================================================

def test_input(json_file: str) -> Tuple[bool, str]:
    """Run a test file through our vulnerable program."""

    try:
        result = subprocess.run(
            [sys.executable, "vulnerable_parser.py", json_file],
            capture_output=True,
            text=True,
            timeout=2
        )

        output = result.stdout + result.stderr
        crashed = "CRASH" in output or result.returncode != 0

        return crashed, output

    except subprocess.TimeoutExpired:
        return True, "CRASH: Timeout - possible infinite loop"
    except Exception as e:
        return False, f"Error running test: {str(e)}"


# ============================================================================
# PART 8: COMPARATIVE FUZZER
# ============================================================================

class ComparativeFuzzer:
    """Runs three separate fuzzing campaigns to compare effectiveness."""

    def __init__(self, seed_files: List[str]):
        """Initialize with seed files."""

        self.corpus = []
        self.crashes = []
        self.coverage_tracker = CoverageTracker()

        for seed_file in seed_files:
            with open(seed_file, 'r') as f:
                try:
                    data = json.load(f)
                    self.corpus.append(data)
                except:
                    pass

        print(f"✓ Fuzzer initialized with {len(self.corpus)} seed files")
        self.use_real_llm = setup_ollama()

    def should_add_to_corpus(self, mutant: dict, output: str) -> bool:
        """Decide if this input is interesting enough to save."""

        bugs_before = self.coverage_tracker.covered_bugs.copy()
        self.coverage_tracker.analyze_output(output)
        new_bugs = self.coverage_tracker.covered_bugs - bugs_before

        return len(new_bugs) > 0

    def run_campaign(self, method_name: str, mutation_func, max_tests=100):
        """Run a fuzzing campaign with ONE specific method."""

        print(f"\n{'=' * 60}")
        print(f"TESTING: {method_name} Fuzzing")
        print(f"{'=' * 60}\n")

        local_corpus = copy.deepcopy(self.corpus)
        local_crashes = []
        local_coverage = CoverageTracker()
        tests_run = 0

        start_time = time.time()

        while tests_run < max_tests:
            parent = random.choice(local_corpus)

            # Generate mutations
            if method_name == "GA":
                mutations = mutation_func(local_corpus, local_crashes, self.use_real_llm)
                if not mutations:
                    continue
            else:
                mutations = mutation_func(parent)

            # Test each mutation
            for mutated in mutations:
                if tests_run >= max_tests:
                    break

                test_file = f"test_files/test_{method_name}_{tests_run}.json"
                try:
                    with open(test_file, 'w') as f:
                        json.dump(mutated, f)
                except:
                    continue

                crashed, output = test_input(test_file)
                tests_run += 1

                local_coverage.analyze_output(output)

                if crashed:
                    local_crashes.append({
                        "test_number": tests_run,
                        "input": mutated,
                        "output": output
                    })

                    if VERBOSE_MODE:
                        print(f"  🐛 Bug #{len(local_crashes)} found at test #{tests_run}")

                    local_corpus.append(mutated)

                elif self.should_add_to_corpus(mutated, output):
                    local_corpus.append(mutated)

            if VERBOSE_MODE and tests_run % 20 == 0:
                print(f"  Progress: {tests_run}/{max_tests} tests, "
                      f"{len(local_crashes)} crashes, "
                      f"{local_coverage.get_coverage()}/5 bug types")

        elapsed_time = time.time() - start_time

        print(f"\n{'=' * 60}")
        print(f"RESULTS: {method_name}")
        print(f"{'=' * 60}")
        print(f"⏱️  Time taken: {elapsed_time:.2f} seconds")
        print(f"🧪 Tests run: {tests_run}")
        print(f"🐛 Crashes found: {len(local_crashes)}")
        print(f"📊 Unique bug types: {local_coverage.get_coverage()}/5")
        print(f"💯 Success rate: {len(local_crashes) / tests_run * 100:.1f}%")

        return {
            "method": method_name,
            "time": elapsed_time,
            "tests": tests_run,
            "crashes": len(local_crashes),
            "bug_types": local_coverage.get_coverage(),
            "crash_details": local_crashes
        }

    def compare_all_methods(self, tests_per_method=100):
        """Run all three methods and compare results."""

        print("\n" + "=" * 60)
        print("COMPARATIVE FUZZING EXPERIMENT")
        print("=" * 60)
        print(f"\nRunning {tests_per_method} tests with each method...")
        print("This will compare Traditional vs LLM vs GA\n")

        results = []

        # 1. Traditional fuzzing
        if VERBOSE_MODE:
            print("\n🔨 Starting Traditional Fuzzing...")
        else:
            print("\n🔨 Traditional Fuzzing...", end=" ")

        results.append(
            self.run_campaign("Traditional", traditional_mutate, tests_per_method)
        )

        if not VERBOSE_MODE:
            print(f"✅ Done! ({results[-1]['crashes']} crashes in {results[-1]['time']:.1f}s)")

        # 2. LLM-guided fuzzing
        if VERBOSE_MODE:
            print("\n🧠 Starting LLM-Guided Fuzzing...")
        else:
            print("🧠 LLM-Guided Fuzzing...", end=" ")

        llm_func = lambda parent: llm_guided_mutate(parent, self.use_real_llm)
        results.append(
            self.run_campaign("LLM", llm_func, tests_per_method)
        )

        if not VERBOSE_MODE:
            print(f"✅ Done! ({results[-1]['crashes']} crashes in {results[-1]['time']:.1f}s)")

        # 3. Genetic Algorithm fuzzing
        if VERBOSE_MODE:
            print("\n🧬 Starting Genetic Algorithm Fuzzing...")
        else:
            print("🧬 Genetic Algorithm Fuzzing...", end=" ")

        results.append(
            self.run_campaign("GA", genetic_evolve, tests_per_method)
        )

        if not VERBOSE_MODE:
            print(f"✅ Done! ({results[-1]['crashes']} crashes in {results[-1]['time']:.1f}s)")

        self.print_comparison(results)

        return results

    def print_comparison(self, results):
        """Print a nice comparison table of all methods."""

        print("\n" + "=" * 60)
        print("FINAL COMPARISON")
        print("=" * 60 + "\n")

        print(f"{'Method':<15} {'Time (s)':<12} {'Crashes':<10} {'Bug Types':<12} {'Success %':<12}")
        print("-" * 60)

        for r in results:
            success_rate = (r['crashes'] / r['tests'] * 100) if r['tests'] > 0 else 0
            print(f"{r['method']:<15} {r['time']:<12.2f} {r['crashes']:<10} "
                  f"{r['bug_types']}/5{'':<8} {success_rate:<12.1f}")

        print("\n" + "=" * 60)

        best_method = max(results, key=lambda x: x['crashes'])
        fastest_method = min(results, key=lambda x: x['time'])
        most_coverage = max(results, key=lambda x: x['bug_types'])

        print("🏆 WINNERS:")
        print(f"  Most crashes found: {best_method['method']} ({best_method['crashes']} crashes)")
        print(f"  Fastest execution: {fastest_method['method']} ({fastest_method['time']:.2f}s)")
        print(f"  Best coverage: {most_coverage['method']} ({most_coverage['bug_types']} bug types)")


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("AI-POWERED FUZZER DEMONSTRATION STARTING...")
    print("=" * 60 + "\n")

    # 1️⃣ Create the vulnerable program
    create_vulnerable_json_parser()

    # 2️⃣ Create seed files
    seed_files = create_seed_files()

    # 3️⃣ Initialize and run the comparative fuzzer
    fuzzer = ComparativeFuzzer(seed_files)

    # 4️⃣ Run the full experiment
    results = fuzzer.compare_all_methods(TESTS_PER_METHOD)

    # 5️⃣ Display summary
    print("\n✅ Experiment complete!")
    print(f"\nTotal methods tested: {len(results)}")
    for r in results:
        print(f"  {r['method']}: {r['crashes']} crashes, {r['bug_types']}/5 bug types")