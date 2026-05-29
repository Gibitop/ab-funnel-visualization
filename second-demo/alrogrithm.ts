const population = 1000;
const iterations = 1000;

type Variant = {
    fraction: number;
    passChance: number;
};

type Step = Variant[];

const steps: Step[] = [
    // Step 0
    [
        { fraction: 0.5, passChance: 0.9 }, // Variant 0
        { fraction: 0.5, passChance: 0.2 }, // Variant 1
    ],
    // Step 1
    [
        { fraction: 0.5, passChance: 0.6 }, // Variant 0
        { fraction: 0.25, passChance: 0.8 }, // Variant 1
        { fraction: 0.25, passChance: 0.4 }, // Variant 2
    ],
    // Step 2
    [
        { fraction: 1 / 3, passChance: 0.7 }, // Variant 0
        { fraction: 1 / 3, passChance: 0.6 }, // Variant 1
        { fraction: 1 / 3, passChance: 0.5 }, // Variant 2
    ],
];


function simulate() {
    const initialUsers = Array(population)
        .fill(null)
        .map(() => steps.map(variants => {
            const rng = Math.random();
            let acc = 0;
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                if (rng >= acc && rng < variant.fraction + acc) {
                    return i;
                }
                acc += variant.fraction;
            }
            // Fallback for floating precision errors
            return variants.length - 1;
        }));

    const enteredStep: typeof initialUsers[] = [initialUsers];
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const entered = enteredStep[i];
        const passed: typeof initialUsers = [];

        for (const user of entered) {
            const variantIndex = user[i];
            const variant = step[variantIndex];

            if (Math.random() < variant.passChance) {
                passed.push(user);
            }
        }
        enteredStep.push(passed);
    }

    const errors: number[][] = [];
    for (let i = 0; i < enteredStep.length - 1; i++) {
        const step = steps[i];
        const stepStats: number[] = [];
        for (let j = 0; j < step.length; j++) {
            const variant = step[j];
            const usersInVariant = enteredStep[i].reduce(
                (acc, user) => user[i] === j ? acc + 1 : acc,
                0
            );
            const fraction = usersInVariant / enteredStep[i].length;
            const error = Math.abs(fraction - variant.fraction);
            stepStats.push(error);
        }
        errors.push(stepStats);
    }

    const fractionOfUsersPerStep = enteredStep.map(u => u.length / initialUsers.length)

    return { errors, fractionOfUsersPerStep };
}

let errors: ReturnType<typeof simulate>['errors'] | null = null
let fractionOfUsersPerStep: ReturnType<typeof simulate>['fractionOfUsersPerStep'] | null = null
for (let i = 0; i < iterations; i++) {
    const {
        errors: iterationErrors,
        fractionOfUsersPerStep: iterationFractionOfUsersPerStep
    } = simulate();

    if (!errors || !fractionOfUsersPerStep) {
        errors = iterationErrors;
        fractionOfUsersPerStep = iterationFractionOfUsersPerStep;
    } else {
        for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
            fractionOfUsersPerStep[stepIndex] += iterationFractionOfUsersPerStep[stepIndex];
            for (let variantIndex = 0; variantIndex < steps[stepIndex].length; variantIndex++) {
                errors[stepIndex][variantIndex] += iterationErrors[stepIndex][variantIndex];
            }
        }
    }
}


for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
    console.log('Step:', stepIndex, '| Fraction of users:', (fractionOfUsersPerStep![stepIndex] / iterations).toFixed(2));
    for (let variantIndex = 0; variantIndex < steps[stepIndex].length; variantIndex++) {
        console.log(
            'Variant:',
            variantIndex,
            '-',
            (errors![stepIndex][variantIndex] / iterations * 100).toFixed(2),
            '%'
        );
    }
    console.log()
}
