/**
 * Question Generator — "Fix The Dataset"
 * Produces 3 high-quality patterns.
 * Single Round Game.
 * Run: node scripts/generate_round1.js
 */

const fs = require('fs');

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Irene', 'James',
    'Karen', 'Leo', 'Maya', 'Nathan', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tara'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Moore',
    'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Lee', 'Walker'];

const years = ['1975', '1980', '1985', '1990', '1992', '1995', '2000'];
const months = [
    { num: '01', short: 'Jan', long: 'January' },
    { num: '03', short: 'Mar', long: 'March' },
    { num: '06', short: 'Jun', long: 'June' },
    { num: '07', short: 'Jul', long: 'July' },
    { num: '09', short: 'Sep', long: 'September' },
    { num: '11', short: 'Nov', long: 'November' }
];
const days = ['05', '12', '15', '20', '28'];
const cities = ['Chicago', 'Houston', 'Phoenix', 'Seattle', 'Denver', 'Atlanta', 'Boston', 'Miami'];
const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Radiology', 'Dermatology', 'Gastroenterology'];

function uniqueName() { return `${pick(firstNames)} ${pick(lastNames)}`; }

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 1: Patient Name + DOB Deduplication
// ────────────────────────────────────────────────────────────────────────────
function makePatientDedupQuestions() {
    const questions = [];

    for (let i = 0; i < 2; i++) {
        const first = pick(firstNames), last = pick(lastNames);
        const m = pick(months), d = pick(days), y = pick(years);
        questions.push({
            dataset: [
                [`${first} ${last}`, `${y}-${m.num}-${d}`, 'Active'],
                [`${first.toUpperCase()} ${last.toUpperCase()}`, `${m.num}/${d}/${y}`, 'Active'],
                [`${first[0]}. ${last}`, `${m.short} ${parseInt(d)}, ${y}`, 'Active'],
                [`${first} ${last}`, `${parseInt(d)} ${m.long} ${y}`, 'Active']
            ],
            question: "How many unique patients are in this dataset? (Same name + DOB = same patient)",
            options: shuffle(["1", "2", "4"]),
            answer: "1"
        });
    }

    for (let i = 0; i < 2; i++) {
        const first = pick(firstNames), last = pick(lastNames);
        const m = pick(months), d = pick(days), y = pick(years);
        const p2 = uniqueName(), p3 = uniqueName();
        const m2 = pick(months), d2 = pick(days);
        const m3 = pick(months), d3 = pick(days);
        questions.push({
            dataset: [
                [`${first} ${last}`, `${y}-${m.num}-${d}`, 'Active'],
                [`${first} ${last}`, `${m.num}/${d}/${y}`, 'Active'],
                [p2, `${y}-${m2.num}-${d2}`, 'Active'],
                [p3, `${y}-${m3.num}-${d3}`, 'Active']
            ],
            question: "How many unique patients are in this dataset? (Same name + DOB = same patient)",
            options: shuffle(["2", "3", "4"]),
            answer: "3"
        });
    }

    return questions;
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 2: Address Deduplication
// ────────────────────────────────────────────────────────────────────────────
function makeAddressDedupQuestions() {
    const questions = [];
    const streetNames = ['Maple', 'Oak', 'Pine', 'Elm', 'Cedar', 'Washington', 'Lake'];
    const types = [{short: 'St', long: 'Street'}, {short: 'Ave', long: 'Avenue'}, {short: 'Blvd', long: 'Boulevard'}, {short: 'Rd', long: 'Road'}];

    for (let i = 0; i < 2; i++) {
        const num = Math.floor(Math.random() * 9000) + 100;
        const name = pick(streetNames);
        const type = pick(types);
        const city = pick(cities);
        questions.push({
            dataset: [
                [`${num} ${name} ${type.short}`, city, 'Active'],
                [`${num} ${name} ${type.long}`, city, 'Active'],
                [`${num} ${name.toUpperCase()} ${type.short.toUpperCase()}`, city, 'Active'],
                [`${num} ${name} ${type.short}.`, city, 'Active']
            ],
            question: "How many unique addresses are in this dataset? (Ignore abbreviations like St/Street)",
            options: shuffle(["1", "2", "4"]),
            answer: "1"
        });
    }

    for (let i = 0; i < 2; i++) {
        const num = Math.floor(Math.random() * 9000) + 100;
        const name = pick(streetNames);
        const type = pick(types);
        const city = pick(cities);
        
        const otherName = pick(streetNames.filter(n => n !== name));

        questions.push({
            dataset: [
                [`${num} ${name} ${type.short}`, city, 'Active'],
                [`${num} ${name} ${type.long}`, city, 'Active'],
                [`${num} ${name.toUpperCase()} ${type.short.toUpperCase()}`, city, 'Active'],
                [`${num + 10} ${otherName} ${pick(types).short}`, pick(cities), 'Active']
            ],
            question: "How many unique addresses are in this dataset? (Ignore abbreviations like St/Street)",
            options: shuffle(["1", "2", "4"]),
            answer: "2"
        });
    }

    for (let i = 0; i < 2; i++) {
        const n1 = pick(streetNames), n2 = pick(streetNames.filter(n => n !== n1));
        const n3 = pick(streetNames.filter(n => n !== n1 && n !== n2));
        const num1 = 123, num2 = 456, num3 = 789;
        const t1 = pick(types), t2 = pick(types), t3 = pick(types);

        questions.push({
            dataset: [
                [`${num1} ${n1} ${t1.short}`, pick(cities), 'Active'],
                [`${num1} ${n1} ${t1.long}`, pick(cities), 'Active'],
                [`${num2} ${n2} ${t2.short}`, pick(cities), 'Active'],
                [`${num3} ${n3} ${t3.short}`, pick(cities), 'Active']
            ],
            question: `How many unique addresses? (Ignore abbreviations like St/Street)`,
            options: shuffle(["2", "3", "4"]),
            answer: "3"
        });
    }

    return questions;
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 3: Conflicting Data for Same Entity
// ────────────────────────────────────────────────────────────────────────────
function makeConflictQuestions() {
    const questions = [];

    const statusPairs = [
        ['APPROVED', 'DENIED'],
        ['PENDING', 'CLOSED'],
        ['ACTIVE', 'CANCELLED'],
        ['PAID', 'REJECTED']
    ];

    // Variation 1: Conflicting Status
    for (let i = 0; i < 2; i++) {
        const claimNum = `CLM-${randInt(1000, 9999)}`;
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        const amount = `$${randInt(500, 9999).toLocaleString()}`;
        const [s1, s2] = pick(statusPairs);

        const q = {
            dataset: [
                [claimNum, name, amount, s1],
                [claimNum, name, amount, s2]
            ],
            question: "AI has verified the above claims. Anything fishy?",
            options: shuffle([
                `Same claim cannot have multiple statuses`,
                "Same claim cannot have two different billed amounts",
                "Same claim is assigned to two completely different patients"
            ]),
            answer: `Same claim cannot have multiple statuses`
        };
        // Add headers for this specific pattern to look robust
        q.dataset.unshift(['Claim ID', 'Patient', 'Amount', 'Status']);
        questions.push(q);
    }

    // Variation 2: Conflicting Amount
    for (let i = 0; i < 2; i++) {
        const claimNum = `CLM-${randInt(1000, 9999)}`;
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        const a1 = `$${randInt(500, 2000).toLocaleString()}`;
        const a2 = `$${randInt(3000, 9999).toLocaleString()}`;
        const status = pick(['APPROVED', 'PENDING']);

        const q = {
            dataset: [
                [claimNum, name, a1, status],
                [claimNum, name, a2, status]
            ],
            question: "AI has verified the above claims. Anything fishy?",
            options: shuffle([
                `Same claim cannot have two different billed amounts`,
                "Same claim is assigned to two completely different patients",
                "Same claim cannot have multiple statuses"
            ]),
            answer: `Same claim cannot have two different billed amounts`
        };
        q.dataset.unshift(['Claim ID', 'Patient', 'Amount', 'Status']);
        questions.push(q);
    }

    // Variation 3: Conflicting Patient Name
    for (let i = 0; i < 2; i++) {
        const claimNum = `CLM-${randInt(1000, 9999)}`;
        const n1 = `${pick(firstNames)} ${pick(lastNames)}`;
        const n2 = `${pick(firstNames)} ${pick(lastNames)}`;
        const amount = `$${randInt(500, 9999).toLocaleString()}`;
        const status = pick(['APPROVED', 'PAID']);

        const q = {
            dataset: [
                [claimNum, n1, amount, status],
                [claimNum, n2, amount, status]
            ],
            question: "AI has verified the above claims. Anything fishy?",
            options: shuffle([
                `Same claim is assigned to two completely different patients`,
                "The claim amount needs to be verified",
                "The status field is duplicated and should be removed"
            ]),
            answer: `Same claim is assigned to two completely different patients`
        };
        q.dataset.unshift(['Claim ID', 'Patient', 'Amount', 'Status']);
        questions.push(q);
    }

    // Doctor Variation 1: Conflicting Specialty
    for (let i = 0; i < 2; i++) {
        const first = pick(firstNames), last = pick(lastNames);
        const sp1 = pick(specialties);
        const sp2 = pick(specialties.filter(s => s !== sp1));
        const city = pick(cities);

        const q = {
            dataset: [
                [`Dr. ${first} ${last}`, sp1, city],
                [`Dr. ${first} ${last}`, sp2, city]
            ],
            question: "AI has verified the above records. Is there a critical error?",
            options: shuffle([
                "Same doctor can't be listed in multiple specialities.",
                "The location field is duplicated and should be removed",
                "Nothing wrong — doctors can have multiple specialties"
            ]),
            answer: `Same doctor can't be listed in multiple specialities.`
        };
        q.dataset.unshift(['Doctor', 'Specialty', 'Location']);
        questions.push(q);
    }

    // Doctor Variation 2: Conflicting Locations
    for (let i = 0; i < 2; i++) {
        const first = pick(firstNames), last = pick(lastNames);
        const sp1 = pick(specialties);
        const city1 = pick(cities);
        const city2 = pick(cities.filter(c => c !== city1));

        const q = {
            dataset: [
                [`Dr. ${first} ${last}`, sp1, city1],
                [`Dr. ${first} ${last}`, sp1, city2]
            ],
            question: "AI has verified the above records. Is there a critical error?",
            options: shuffle([
                "A doctor cannot be practicing full-time in multiple cities.",
                "Specialty field is duplicated and should be removed",
                "Same doctor can't be listed in multiple specialities."
            ]),
            answer: `A doctor cannot be practicing full-time in multiple cities.`
        };
        q.dataset.unshift(['Doctor', 'Specialty', 'Location']);
        questions.push(q);
    }

    return questions;
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 4: Communication Channels
// ────────────────────────────────────────────────────────────────────────────
function makeCommunicationQuestions() {
    const questions = [];
    const domains = ['gmail.com', 'yahoo.com', 'clinic.org'];

    // Variation 1: 1 distinct pair (duplicates with different formats)
    for (let i=0; i<2; i++) {
        const first = pick(firstNames), last = pick(lastNames);
        const phone = randInt(1000000000, 9999999999).toString();
        const email = `${first.toLowerCase()}.${last.toLowerCase()}@${pick(domains)}`;
        
        const p1 = `(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6)}`;
        const p2 = `${phone.substring(0,3)}-${phone.substring(3,6)}-${phone.substring(6)}`;
        const p3 = phone;
        
        const q = {
            dataset: [
                [`${first} ${last}`, p1, email],
                [`${first} ${last}`, p2, email.toUpperCase()],
                [`${first} ${last}`, p3, email]
            ],
            question: "If we normalize the formatting, how many distinct communication channels (unique phone + email pairs) exist?",
            options: shuffle(["1", "2", "3"]),
            answer: "1"
        };
        q.dataset.unshift(['Patient', 'Phone', 'Email']);
        questions.push(q);
    }

    // Variation 2: 2 distinct pairs
    for (let i=0; i<2; i++) {
        const first = pick(firstNames), last = pick(lastNames);
        const pA = `555-010-0001`;
        const pB = `(555) 010-0001`;
        const pC = `555-010-0002`;
        const emailA = `test@test.com`;
        const emailB = `other@test.com`;

        const q = {
            dataset: [
                [`${first} ${last}`, pA, emailA],
                [`${first} ${last}`, pB, emailA],
                [`${first} ${last}`, pC, emailB]
            ],
            question: "If we normalize the formatting, how many distinct communication channels (unique phone + email pairs) exist?",
            options: shuffle(["1", "2", "3"]),
            answer: "2"
        };
        q.dataset.unshift(['Patient', 'Phone', 'Email']);
        questions.push(q);
    }

    return questions;
}

// ────────────────────────────────────────────────────────────────────────────
// PATTERN 5: Appointment Logs
// ────────────────────────────────────────────────────────────────────────────
function makeAppointmentQuestions() {
    const questions = [];
    const times = ['09:00 AM - 09:45 AM', '10:00 AM - 11:00 AM', '11:30 AM - 12:30 PM', '01:00 PM - 02:00 PM', '02:30 PM - 03:30 PM'];
    const docs = ['Dr. Smith', 'Dr. Jones', 'Dr. Lee'];

    const options = [
        "Nothing is wrong",
        "Duplicate entries",
        "Conflicting time (same patient can't have conflicting appointment)",
        "Missing details"
    ];

    // Sub-pattern: Conflicting time
    for (let i = 0; i < 2; i++) {
        const patient = uniqueName();
        const date = `2024-05-${pick(days)}`;
        const time1 = '09:00 AM - 10:00 AM';
        const time2 = '09:30 AM - 10:30 AM';
        const d1 = docs[0];
        const d2 = docs[1];

        const q = {
            dataset: [
                [patient, date, time1, d1],
                [patient, date, time2, d2]
            ],
            question: "Health provider appointment logs are given, what's the issue with the data?",
            options: shuffle([...options]),
            answer: "Conflicting time (same patient can't have conflicting appointment)"
        };
        q.dataset.unshift(['Patient', 'Date', 'Time', 'Doctor']);
        questions.push(q);
    }

    // Sub-pattern: Duplicate entries
    for (let i = 0; i < 2; i++) {
        const patient = uniqueName();
        const date = `2024-05-${pick(days)}`;
        const time = pick(times);
        const doc = pick(docs);

        const q = {
            dataset: [
                [patient, date, time, doc],
                [patient, date, time, doc]
            ],
            question: "Health provider appointment logs are given, what's the issue with the data?",
            options: shuffle([...options]),
            answer: "Duplicate entries"
        };
        q.dataset.unshift(['Patient', 'Date', 'Time', 'Doctor']);
        questions.push(q);
    }
    
    // Sub-pattern: missing details
    for (let i = 0; i < 2; i++) {
        const patient = uniqueName();
        const date = `2024-05-${pick(days)}`;
        const time = pick(times);
        const doc = pick(docs);

        const q = {
            dataset: [
                [patient, date, time, doc],
                [patient, date, "", doc]
            ],
            question: "Health provider appointment logs are given, what's the issue with the data?",
            options: shuffle([...options]),
            answer: "Missing details"
        };
        q.dataset.unshift(['Patient', 'Date', 'Time', 'Doctor']);
        questions.push(q);
    }

    // Sub-pattern: Nothing is wrong
    for (let i = 0; i < 2; i++) {
        const patient = uniqueName();
        const date = `2024-05-${pick(days)}`;
        const time1 = times[0];
        const time2 = times[1];
        const doc = pick(docs);

        const q = {
            dataset: [
                [patient, date, time1, doc],
                [patient, date, time2, doc]
            ],
            question: "Health provider appointment logs are given, what's the issue with the data?",
            options: shuffle([...options]),
            answer: "Nothing is wrong"
        };
        q.dataset.unshift(['Patient', 'Date', 'Time', 'Doctor']);
        questions.push(q);
    }

    return questions;
}

// ── Generate and save ─────────────────────────────────────────────────────
const allQuestions = [
    ...makePatientDedupQuestions(),
    ...makeAddressDedupQuestions(),
    ...makeConflictQuestions(),
    ...makeCommunicationQuestions(),
    ...makeAppointmentQuestions()
];

// Shuffle dataset rows within each question if there's no header, or shuffle the data rows keeping header intact.
allQuestions.forEach(q => { 
    // pattern 3, 4, 5 typically have headers. We check for common ones.
    if(q.dataset[0].includes('Claim ID') || q.dataset[0].includes('Doctor') || q.dataset[0].includes('Hospital') || q.dataset[0].includes('Name') || q.dataset[0].includes('Patient')) {
        const header = q.dataset[0];
        const dataRows = shuffle(q.dataset.slice(1));
        q.dataset = [header, ...dataRows];
    } else {
        q.dataset = shuffle(q.dataset); 
    }
});

const shuffled = shuffle(allQuestions);
fs.writeFileSync('./data/round1_questions.json', JSON.stringify(shuffled, null, 2));
console.log(`✅ Generated ${shuffled.length} Questions → data/round1_questions.json`);
