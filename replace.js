const fs = require('fs');
let content = fs.readFileSync('scripts/generate_round1.js', 'utf8');

const oldPattern = /\/\/ ────────────────────────────────────────────────────────────────────────────\n\/\/ PATTERN 2: Drug \/ Medication Deduplication[\s\S]*?\/\/ ── Generate and save ─────────────────────────────────────────────────────\nconst allQuestions = \[\n    \.\.\.makePatientDedupQuestions\(\),     \/\/ 7 questions\n    \.\.\.makeDrugDedupQuestions\(\)         \/\/ 7 questions\n\];/;

const newPattern = `// ────────────────────────────────────────────────────────────────────────────
// PATTERN 2: Address Deduplication
// Shows address records where abbreviations and formats vary.
// Player needs to identify which rows refer to the same address.
// ────────────────────────────────────────────────────────────────────────────
function makeAddressDedupQuestions() {
    const questions = [];
    const streetNames = ['Maple', 'Oak', 'Pine', 'Elm', 'Cedar', 'Washington', 'Lake'];
    const types = [{short: 'St', long: 'Street'}, {short: 'Ave', long: 'Avenue'}, {short: 'Blvd', long: 'Boulevard'}, {short: 'Rd', long: 'Road'}];

    // Sub-pattern A: All rows same address → Answer: 1
    for (let i = 0; i < 2; i++) {
        const num = Math.floor(Math.random() * 9000) + 100;
        const name = pick(streetNames);
        const type = pick(types);
        const city = pick(cities);
        questions.push({
            dataset: [
                [\`\${num} \${name} \${type.short}\`, city, 'Active'],
                [\`\${num} \${name} \${type.long}\`, city, 'Active'],
                [\`\${num} \${name.toUpperCase()} \${type.short.toUpperCase()}\`, city, 'Active'],
                [\`\${num} \${name} \${type.short}.\`, city, 'Active']
            ],
            question: "How many unique addresses are in this dataset? (Ignore abbreviations like St/Street)",
            options: shuffle(["1", "2", "4"]),
            answer: "1"
        });
    }

    // Sub-pattern B: 3 same address + 1 different → Answer: 2
    for (let i = 0; i < 3; i++) {
        const num = Math.floor(Math.random() * 9000) + 100;
        const name = pick(streetNames);
        const type = pick(types);
        const city = pick(cities);
        
        const otherName = pick(streetNames.filter(n => n !== name));

        questions.push({
            dataset: [
                [\`\${num} \${name} \${type.short}\`, city, 'Active'],
                [\`\${num} \${name} \${type.long}\`, city, 'Active'],
                [\`\${num} \${name.toUpperCase()} \${type.short.toUpperCase()}\`, city, 'Active'],
                [\`\${num + 10} \${otherName} \${pick(types).short}\`, pick(cities), 'Active']
            ],
            question: "How many unique addresses are in this dataset? (Ignore abbreviations like St/Street)",
            options: shuffle(["1", "2", "4"]),
            answer: "2"
        });
    }

    // Sub-pattern C: Address A (short+long) + Address B (short+long) → Answer: 2
    for (let i = 0; i < 2; i++) {
        const n1 = pick(streetNames), n2 = pick(streetNames.filter(n => n !== n1));
        const num1 = 123, num2 = 456;
        const t1 = pick(types), t2 = pick(types);

        questions.push({
            dataset: [
                [\`\${num1} \${n1} \${t1.short}\`, pick(cities), 'Active'],
                [\`\${num1} \${n1} \${t1.long}\`, pick(cities), 'Active'],
                [\`\${num2} \${n2} \${t2.short}\`, pick(cities), 'Active'],
                [\`\${num2} \${n2} \${t2.long}\`, pick(cities), 'Active']
            ],
            question: \`How many unique addresses? (Ignore abbreviations)\`,
            options: shuffle(["2", "3", "4"]),
            answer: "2"
        });
    }

    return questions;
}

// ── Generate and save ─────────────────────────────────────────────────────
const allQuestions = [
    ...makePatientDedupQuestions(),     // 7 questions
    ...makeAddressDedupQuestions()      // 7 questions
];`;

content = content.replace(oldPattern, newPattern);
fs.writeFileSync('scripts/generate_round1.js', content, 'utf8');

