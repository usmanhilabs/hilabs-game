/**
 * Round 1 Question Generator
 * Generates ~200 unique healthcare data deduplication questions.
 * Run: node scripts/generate_round1.js
 */

const fs = require('fs');

// ── Helpers ────────────────────────────────────────────────────────────────
const shuffle = arr => arr.sort(() => Math.random() - 0.5);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ── Pattern 1: Name variation deduplication ────────────────────────────────
const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Irene', 'James',
    'Karen', 'Leo', 'Maya', 'Nathan', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tara'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Moore',
    'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Lee', 'Walker'];

const titles = ['Dr.', 'Dr', 'Doctor'];
const titleSuffixes = ['MD', 'M.D.', 'PhD', 'M.D'];

function nameVariants(first, last) {
    return [
        `${pick(titles)} ${first} ${last}`,
        `${first} ${last} ${pick(titleSuffixes)}`,
        `${pick(titles)} ${first[0]}. ${last}`
    ];
}

function makeNameQuestion() {
    const first = pick(firstNames), last = pick(lastNames);
    const extra1 = pick(firstNames), extra2 = pick(lastNames);
    const variants = nameVariants(first, last);
    return {
        dataset: [...variants.map(n => [n, "NPI-" + Math.floor(10000 + Math.random() * 90000)]),
        [`${extra1} ${extra2}`, "NPI-" + Math.floor(10000 + Math.random() * 90000)]],
        question: "How many unique doctors exist in this dataset?",
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 2: DOB format deduplication ────────────────────────────────────
const years = ['1975', '1980', '1985', '1990', '1992', '1995', '2000'];
const months = [['01', 'Jan', 'January'], ['03', 'Mar', 'March'], ['07', 'Jul', 'July'], ['11', 'Nov', 'November']];
const days = ['05', '12', '20', '28'];

function makeDOBQuestion() {
    const [m, mShort, mLong] = pick(months);
    const d = pick(days), y = pick(years);
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const uniquePatient = `${pick(firstNames)} ${pick(lastNames)}`;
    return {
        dataset: [
            [name, `${y}-${m}-${d}`, 'F'],
            [name, `${m}/${d}/${y}`, 'Female'],
            [name, `${mShort} ${d}, ${y}`, 'F'],
            [uniquePatient, `${y}-0${parseInt(m) + 1}-15`, 'M']
        ],
        question: "How many unique patients exist? (Same name + DOB = same patient)",
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 3: Hospital name deduplication ─────────────────────────────────
const hospitalBases = ['City', 'Metro', 'General', 'Regional', 'Community', 'Memorial', 'St. Luke', 'Providence', 'Unity', 'Highland'];
const hospitalTypes = ['Hospital', 'Medical Center', 'Clinic', 'Health', 'Care'];
const cities = ['Chicago', 'Houston', 'Phoenix', 'Seattle', 'Denver', 'Atlanta', 'Boston', 'Miami'];
const states = ['IL', 'TX', 'AZ', 'WA', 'CO', 'GA', 'MA', 'FL'];

function makeHospitalQuestion() {
    const base = pick(hospitalBases), type = pick(hospitalTypes);
    const fullName = `${base} ${type}`;
    const cityIdx = Math.floor(Math.random() * cities.length);
    const city = cities[cityIdx], state = states[cityIdx];
    const uniqueIdx = (cityIdx + 1) % cities.length;
    return {
        dataset: [
            [fullName, city, state],
            [fullName.toLowerCase(), city.toLowerCase(), state.toLowerCase()],
            [`${base} ${type.charAt(0)}.`, city, state],
            [pick(hospitalBases) + " " + pick(hospitalTypes), cities[uniqueIdx], states[uniqueIdx]]
        ],
        question: "How many unique healthcare facilities exist?",
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 4: Address normalization ──────────────────────────────────────
const streetNumbers = ['100', '250', '500', '1200', '840'];
const streetNames = ['Main St', 'Oak Ave', 'Elm Blvd', 'Park Rd', 'Lake Dr'];
const aptVariants = [['Suite 4', 'Ste. 4', 'Ste 4'], ['Apt 2B', '#2B', 'Unit 2B'], ['Rm 101', 'Room 101', 'Rm. 101']];

function makeAddressQuestion() {
    const num = pick(streetNumbers), street = pick(streetNames);
    const [apt1, apt2, apt3] = pick(aptVariants);
    const uniqueNum = pick(streetNumbers.filter(n => n !== num));
    return {
        dataset: [
            [`${num} ${street}`, apt1, pick(cities)],
            [`${num} ${street.toLowerCase()}`, apt2, pick(cities)],
            [`${num} ${street}.`, apt3, pick(cities)],
            [`${uniqueNum} ${street}`, apt1, pick(cities)]
        ],
        question: "How many unique addresses exist in this dataset?",
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 5: Drug name deduplication ────────────────────────────────────
const drugPairs = [
    ["Paracetamol", "Acetaminophen"],
    ["Epinephrine", "Adrenaline"],
    ["Methamphetamine", "Desoxyephedrine"],
    ["Aspirin", "Acetylsalicylic Acid"],
    ["Tylenol", "Acetaminophen"]
];
const doses = ['100mg', '250mg', '500mg', '1000mg'];
const routes = ['Oral', 'IV', 'Sublingual'];

function makeDrugQuestion() {
    const [nameA, nameB] = pick(drugPairs);
    const dose = pick(doses), route = pick(routes);
    const uniqueDrug = pick(['Ibuprofen', 'Metformin', 'Lisinopril', 'Atorvastatin']);
    return {
        dataset: [
            [nameA, dose, route],
            [nameB, dose, route],
            [nameA.toUpperCase(), dose.replace('mg', ' MG'), route.toLowerCase()],
            [uniqueDrug, pick(doses), pick(routes)]
        ],
        question: `How many unique drugs? (${nameA} = ${nameB})`,
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 6: Diagnosis code deduplication ───────────────────────────────
const diagnosisPairs = [
    ["ICD-10: E11.9", "E11.9", "Type 2 Diabetes", "T2DM", "Diabetes Mellitus Type II"],
    ["ICD-10: I10", "I10", "Hypertension", "HTN", "High Blood Pressure"],
    ["ICD-10: J18.9", "J18.9", "Pneumonia", "Community Acquired Pneumonia", "CAP"],
    ["ICD-10: K21.0", "K21.0", "GERD", "Acid Reflux", "Gastroesophageal Reflux Disease"],
    ["ICD-10: M79.3", "M79.3", "Fibromyalgia", "FM", "Fibromyalgia Syndrome"]
];

function makeDiagnosisQuestion() {
    const [code1, code2, name1, name2, name3] = pick(diagnosisPairs);
    const uniqueCode = "ICD-10: Z00.0";
    return {
        dataset: [
            [code1, name1],
            [code2, name2],
            [code2, name3],
            [uniqueCode, "Annual Wellness Visit"]
        ],
        question: `How many unique diagnoses exist? (${name1} = ${name2} = ${name3})`,
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 7: Gender normalization ───────────────────────────────────────
function makeGenderQuestion() {
    const maleVariants = shuffle(['M', 'Male', 'MALE', 'male', '1']);
    const femaleVariants = shuffle(['F', 'Female', 'FEMALE', 'female', '2']);
    return {
        dataset: [
            ["Gender", "Code"],
            [maleVariants[0], "001"],
            [maleVariants[1], "002"],
            [femaleVariants[0], "003"],
            [femaleVariants[1], "004"]
        ],
        question: "How many unique gender values exist in this dataset?",
        options: shuffle(["2", "3", "5"]),
        answer: "2"
    };
}

// ── Pattern 8: Phone number normalization ─────────────────────────────────
function makePhoneQuestion() {
    const areaCode = pick(['555', '312', '415', '212', '646']);
    const num1 = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const num2 = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const name1 = `${pick(firstNames)} ${pick(lastNames)}`;
    const name2 = `${pick(firstNames)} ${pick(lastNames)}`;
    return {
        dataset: [
            [name1, `${areaCode}-${num1}`],
            [name1, `(${areaCode}) ${num1}`],
            [name1, `${areaCode}${num1.replace('-', '')}`],
            [name2, `${areaCode}-${num2}`]
        ],
        question: "How many unique patients have phone records?",
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 9: Appointment date duplicates ────────────────────────────────
function makeAppointmentQuestion() {
    const [m, mShort] = pick(months);
    const d = pick(days), y = pick(years);
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    return {
        dataset: [
            [name, `${y}-${m}-${d}`, "Checkup"],
            [name, `${m}/${d}/${y}`, "Checkup"],
            [name, `${mShort} ${parseInt(d)}, ${y}`, "Checkup"],
            [`${pick(firstNames)} ${pick(lastNames)}`, `${y}-${m}-${d}`, "Follow-Up"]
        ],
        question: "How many unique appointments exist? (Same patient + date + type = duplicate)",
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Pattern 10: Insurance ID normalization ────────────────────────────────
function makeInsuranceQuestion() {
    const insurers = ['BlueCross', 'Aetna', 'Cigna', 'United', 'Humana'];
    const insurer = pick(insurers);
    const id = `INS-${Math.floor(10000 + Math.random() * 90000)}`;
    const idClean = id.replace('INS-', '').replace('-', '');
    return {
        dataset: [
            ["Patient A", insurer, id],
            ["Patient A", insurer, `${idClean}`],
            ["Patient A", insurer.toUpperCase(), id],
            ["Patient B", pick(insurers.filter(i => i !== insurer)), `INS-${Math.floor(10000 + Math.random() * 90000)}`]
        ],
        question: "How many unique insurance records exist?",
        options: shuffle(["1", "2", "4"]),
        answer: "2"
    };
}

// ── Generate and save ─────────────────────────────────────────────────────
const generators = [
    makeNameQuestion, makeDOBQuestion, makeHospitalQuestion, makeAddressQuestion,
    makeDrugQuestion, makeDiagnosisQuestion, makeGenderQuestion,
    makePhoneQuestion, makeAppointmentQuestion, makeInsuranceQuestion
];

const questions = [];
for (let i = 0; i < 200; i++) {
    const gen = generators[i % generators.length];
    questions.push(gen());
}

fs.writeFileSync('./data/round1_questions.json', JSON.stringify(questions, null, 2));
console.log(`✅ Generated ${questions.length} Round 1 questions → data/round1_questions.json`);
