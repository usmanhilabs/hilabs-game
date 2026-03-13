/**
 * Round 2 Question Generator
 * Generates ~200 unique "Beat the AI" error-detection questions.
 * Questions ask players to spot what the AI got wrong.
 * Run: node scripts/generate_round2.js
 */

const fs = require('fs');

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => arr.sort(() => Math.random() - 0.5);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Irene', 'James', 'Karen', 'Leo'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Moore'];
const cities = ['Delhi', 'Mumbai', 'Chicago', 'Houston', 'Atlanta', 'Seattle', 'Phoenix', 'Boston'];
const stateCodes = { Delhi: 'DL', Mumbai: 'MH', Chicago: 'IL', Houston: 'TX', Atlanta: 'GA', Seattle: 'WA', Phoenix: 'AZ', Boston: 'MA' };
const wrongStateCodes = { Delhi: 'MH', Mumbai: 'DL', Chicago: 'TX', Houston: 'IL', Atlanta: 'FL', Seattle: 'OR', Phoenix: 'NV', Boston: 'NY' };

// ── Pattern 1: Wrong state/city mismatch ─────────────────────────────────
function makeStateMismatch() {
    const city = pick(cities);
    const correctState = stateCodes[city];
    const wrongState = wrongStateCodes[city];
    const hospital = pick(['Apollo', 'Fortis', 'Max', 'AIIMS', 'Medanta']) + ' ' + pick(['Hospital', 'Clinic', 'Medical Center']);
    return {
        dataset: [
            [hospital, city, wrongState]
        ],
        question: "What did the AI get wrong in this hospital record?",
        options: shuffle([
            `Wrong state code for ${city} (should be ${correctState})`,
            "Duplicate hospital entry",
            "Nothing is wrong"
        ]),
        answer: `Wrong state code for ${city} (should be ${correctState})`
    };
}

// ── Pattern 2: Conflicting specialty for same doctor ─────────────────────
function makeDoctorSpecialtyConflict() {
    const firstName = pick(firstNames), lastName = pick(lastNames);
    const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Radiology', 'Dermatology'];
    const sp1 = pick(specialties);
    const sp2 = pick(specialties.filter(s => s !== sp1));
    const city = pick(cities);
    return {
        dataset: [
            [`Dr. ${firstName} ${lastName}`, sp1, city],
            [`Dr. ${firstName} ${lastName}`, sp2, city]
        ],
        question: "What error did the AI make in this doctor record?",
        options: shuffle([
            `Conflicting specialties for same doctor (${sp1} vs ${sp2})`,
            "Wrong doctor name format",
            "City field is duplicated"
        ]),
        answer: `Conflicting specialties for same doctor (${sp1} vs ${sp2})`
    };
}

// ── Pattern 3: Same claim, conflicting status ─────────────────────────────
function makeClaimConflict() {
    const claimNum = `#${randInt(1000, 9999)}`;
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const amount = `$${randInt(500, 5000)}`;
    const statuses = [['APPROVED', 'DENIED'], ['PENDING', 'CLOSED'], ['ACTIVE', 'CANCELLED']];
    const [s1, s2] = pick(statuses);
    return {
        dataset: [
            [`Claim ${claimNum}`, name, amount, s1],
            [`Claim ${claimNum}`, name, amount, s2]
        ],
        question: "The AI kept both records. What's critically wrong?",
        options: shuffle([
            `Same claim cannot be both ${s1} and ${s2}`,
            "Name format is inconsistent",
            "Claim amount is incorrect"
        ]),
        answer: `Same claim cannot be both ${s1} and ${s2}`
    };
}

// ── Pattern 4: Conflicting lab result ─────────────────────────────────────
function makeLabResultConflict() {
    const patient = `Patient: ${randInt(1000, 9999)}`;
    const tests = [
        ['WBC', `${(2 + Math.random() * 5).toFixed(1)}`, '(NORMAL)', `${(12 + Math.random() * 5).toFixed(1)}`, '(HIGH)'],
        ['HbA1c', `${(5 + Math.random()).toFixed(1)}%`, '(NORMAL)', `${(8 + Math.random() * 2).toFixed(1)}%`, '(DIABETIC)'],
        ['eGFR', `${randInt(70, 100)}`, '(NORMAL)', `${randInt(20, 45)}`, '(STAGE 3 CKD)'],
        ['Troponin', '0.01 (NORMAL)', '(NEGATIVE)', '2.5 (ELEVATED)', '(POSITIVE)']
    ];
    const [test, val1, risk1, val2, risk2] = pick(tests);
    const date = `2024-0${randInt(1, 9)}-${randInt(10, 28)}`;
    return {
        dataset: [
            [patient, `Lab: ${test}`, `Date: ${date}`, `${val1} ${risk1}`],
            [patient, `Lab: ${test}`, `Date: ${date}`, `${val2} ${risk2}`]
        ],
        question: "What is the most dangerous AI error in this lab record?",
        options: shuffle([
            `Conflicting ${test} results for same patient on same date`,
            "Date format is inconsistent",
            "Lab test name is abbreviated"
        ]),
        answer: `Conflicting ${test} results for same patient on same date`
    };
}

// ── Pattern 5: Name variation masked a merged dedup ───────────────────────
function makeSpuriousMerge() {
    const first1 = pick(firstNames), last = pick(lastNames);
    const first2 = pick(firstNames.filter(n => n !== first1));
    const dob1 = `19${randInt(70, 95)}-0${randInt(1, 9)}-${randInt(10, 28)}`;
    const dob2 = `19${randInt(60, 80)}-${randInt(10, 12)}-${randInt(10, 28)}`;
    return {
        dataset: [
            [`${first1} ${last}`, dob1, "Cardiology"],
            [`${first2} ${last}`, dob2, "Oncology"]
        ],
        question: "The AI merged these as duplicates (same last name). What's wrong?",
        options: shuffle([
            "Different first names AND DOBs — these are two distinct patients",
            "The specialty field is inconsistent",
            "Last name format is different"
        ]),
        answer: "Different first names AND DOBs — these are two distinct patients"
    };
}

// ── Pattern 6: Bed count discrepancy ──────────────────────────────────────
function makeHospitalBedConflict() {
    const base = pick(['St. Mary', 'General', 'Metro', 'Unity', 'Memorial']);
    const nameVariant = pick([base, base.toLowerCase(), `${base} Hospital`]);
    const beds1 = randInt(50, 200);
    const beds2 = beds1 + pick([100, 200, 300, 500]);
    return {
        dataset: [
            [`${base} Hospital`, `${beds1} Beds`, "ICU: Yes"],
            [nameVariant, `${beds2} Beds`, "ICU: Yes"]
        ],
        question: "The AI merged these as the same hospital. What should it have flagged?",
        options: shuffle([
            `Critical bed count difference (${beds1} vs ${beds2}) suggests different facilities`,
            "Nothing wrong — name variations are expected",
            "ICU field should not be included"
        ]),
        answer: `Critical bed count difference (${beds1} vs ${beds2}) suggests different facilities`
    };
}

// ── Pattern 7: NPI uniqueness violation ───────────────────────────────────
function makeNPIConflict() {
    const npi = `12345${randInt(10000, 99999)}`;
    const name = `Dr. ${pick(firstNames)} ${pick(lastNames)}`;
    const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology'];
    const sp = pick(specialties);
    const state1 = 'CA', state2 = 'TX';
    return {
        dataset: [
            [`NPI: ${npi}`, name, sp, `State: ${state1}`],
            [`NPI: ${npi}`, name, sp, `State: ${state2}`]
        ],
        question: "Same NPI in two states. What should the AI flag?",
        options: shuffle([
            "Flag for human review — NPI is nationally unique and this is a potential data error",
            "This is valid — doctors can practice in multiple states",
            "The specialty should be split"
        ]),
        answer: "Flag for human review — NPI is nationally unique and this is a potential data error"
    };
}

// ── Pattern 8: Drug dosage conflict ───────────────────────────────────────
function makeDrugDosageConflict() {
    const drugs = ['Aspirin', 'Metformin', 'Lisinopril', 'Atorvastatin', 'Warfarin', 'Insulin'];
    const drug = pick(drugs);
    const d1 = pick(['100mg', '250mg', '500mg']), d2 = pick(['1000mg', '2000mg', '5mg']);
    const route = pick(['Oral', 'IV', 'Sublingual']);
    return {
        dataset: [
            [drug, d1, route, "Daily"],
            [drug, d2, route, "Daily"]
        ],
        question: "The AI kept one record. Which approach is correct?",
        options: shuffle([
            `Keep both — different doses (${d1} vs ${d2}) represent distinct prescriptions`,
            "Merge them — same drug and route is sufficient for deduplication",
            "Delete both — conflicting data should always be removed"
        ]),
        answer: `Keep both — different doses (${d1} vs ${d2}) represent distinct prescriptions`
    };
}

// ── Pattern 9: Multiple contact info conflicts ─────────────────────────────
function makeContactConflict() {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const phone1 = `555-${randInt(100, 999)}-${randInt(1000, 9999)}`;
    const phone2 = `555-${randInt(100, 999)}-${randInt(1000, 9999)}`;
    const email1 = `user${randInt(1, 99)}@example.com`;
    const email2 = `user${randInt(100, 999)}@hospital.org`;
    return {
        dataset: [
            [name, phone1, email1],
            [name, phone1, email2],
            [name, phone2, email1]
        ],
        question: "What data inconsistency did the AI fail to flag?",
        options: shuffle([
            "Multiple conflicting phone+email combinations make the correct contact ambiguous",
            "Email format is invalid",
            "Phone number format is inconsistent"
        ]),
        answer: "Multiple conflicting phone+email combinations make the correct contact ambiguous"
    };
}

// ── Pattern 10: ACTIVE vs CLOSED status conflict ──────────────────────────
function makeStatusConflict() {
    const pharmacies = ['Sunrise Pharmacy', 'City Drugs', 'MedPlus', 'Apollo Pharmacy', 'Wellness Plus'];
    const pharmacy = pick(pharmacies);
    const nameVariant = `${pharmacy} Inc.`;
    const city = pick(cities);
    const statuses = [['ACTIVE', 'CLOSED'], ['OPEN', 'SUSPENDED'], ['IN-NETWORK', 'OUT-OF-NETWORK']];
    const [s1, s2] = pick(statuses);
    return {
        dataset: [
            [pharmacy, city, s1],
            [nameVariant, city, s2]
        ],
        question: "The AI couldn't decide if these are duplicates. What's the critical conflict?",
        options: shuffle([
            `Name format differs AND operational status conflicts (${s1} vs ${s2})`,
            "City name should be a state code",
            "Pharmacy types are not comparable"
        ]),
        answer: `Name format differs AND operational status conflicts (${s1} vs ${s2})`
    };
}

// ── Generate and save ─────────────────────────────────────────────────────
const generators = [
    makeStateMismatch, makeDoctorSpecialtyConflict, makeClaimConflict, makeLabResultConflict,
    makeSpuriousMerge, makeHospitalBedConflict, makeNPIConflict,
    makeDrugDosageConflict, makeContactConflict, makeStatusConflict
];

const questions = [];
for (let i = 0; i < 200; i++) {
    const gen = generators[i % generators.length];
    questions.push(gen());
}

fs.writeFileSync('./data/round2_questions.json', JSON.stringify(questions, null, 2));
console.log(`✅ Generated ${questions.length} Round 2 questions → data/round2_questions.json`);
